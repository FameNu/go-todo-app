package service

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/famenu/go-todo-app/api/internal/models"
	"github.com/famenu/go-todo-app/api/internal/repository"
)

var (
	ErrNotFound = errors.New("resource not found")
	ErrInvalid  = errors.New("invalid request")
	ErrConflict = errors.New("resource already exists")
)

type CategoryService struct{ categories repository.CategoryStore }

func NewCategoryService(categories repository.CategoryStore) *CategoryService {
	return &CategoryService{categories: categories}
}

func (s *CategoryService) Create(name, color string) (models.Category, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return models.Category{}, fmt.Errorf("%w: name is required", ErrInvalid)
	}
	if color == "" {
		color = "#3B82F6"
	}
	category := models.Category{Name: name, Color: color}
	if err := s.categories.Create(&category); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "unique") || strings.Contains(strings.ToLower(err.Error()), "duplicate") {
			return models.Category{}, fmt.Errorf("%w: category name must be unique", ErrConflict)
		}
		return models.Category{}, err
	}
	return category, nil
}

func (s *CategoryService) List() ([]models.Category, error) { return s.categories.List() }

type TodoService struct {
	todos      repository.TodoStore
	categories repository.CategoryStore
}

func NewTodoService(todos repository.TodoStore, categories repository.CategoryStore) *TodoService {
	return &TodoService{todos: todos, categories: categories}
}

type CreateTodoInput struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      string     `json:"status"`
	Priority    string     `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  uint       `json:"category_id"`
}

type UpdateTodoInput struct {
	Title    *string `json:"title"`
	Status   *string `json:"status"`
	Priority *string `json:"priority"`
}

func (s *TodoService) Create(input CreateTodoInput) (models.Todo, error) {
	input.Title = strings.TrimSpace(input.Title)
	if input.Title == "" {
		return models.Todo{}, fmt.Errorf("%w: title is required", ErrInvalid)
	}
	if input.CategoryID == 0 {
		return models.Todo{}, fmt.Errorf("%w: category_id is required", ErrInvalid)
	}
	exists, err := s.categories.Exists(input.CategoryID)
	if err != nil {
		return models.Todo{}, err
	}
	if !exists {
		return models.Todo{}, fmt.Errorf("%w: category_id does not exist", ErrInvalid)
	}
	if input.Status == "" {
		input.Status = models.StatusPending
	}
	if input.Priority == "" {
		input.Priority = models.PriorityMedium
	}
	if !validStatus(input.Status) || !validPriority(input.Priority) {
		return models.Todo{}, fmt.Errorf("%w: unsupported status or priority", ErrInvalid)
	}
	todo := models.Todo{Title: input.Title, Description: input.Description, Status: input.Status,
		Priority: input.Priority, DueDate: input.DueDate, CategoryID: input.CategoryID}
	if err := s.todos.Create(&todo); err != nil {
		return models.Todo{}, err
	}
	return s.todos.Get(todo.ID)
}

func (s *TodoService) List(status string, categoryID *uint) ([]models.Todo, error) {
	if status != "" && !validStatus(status) {
		return nil, fmt.Errorf("%w: unsupported status", ErrInvalid)
	}
	return s.todos.List(status, categoryID)
}

func (s *TodoService) Get(id uint) (models.Todo, error) {
	todo, err := s.todos.Get(id)
	if errors.Is(err, repository.ErrNotFound) {
		return models.Todo{}, ErrNotFound
	}
	return todo, err
}

func (s *TodoService) Update(id uint, input UpdateTodoInput) (models.Todo, error) {
	fields := make(map[string]any)
	if input.Title != nil {
		title := strings.TrimSpace(*input.Title)
		if title == "" {
			return models.Todo{}, fmt.Errorf("%w: title cannot be empty", ErrInvalid)
		}
		fields["title"] = title
	}
	if input.Status != nil {
		if !validStatus(*input.Status) {
			return models.Todo{}, fmt.Errorf("%w: unsupported status", ErrInvalid)
		}
		fields["status"] = *input.Status
	}
	if input.Priority != nil {
		if !validPriority(*input.Priority) {
			return models.Todo{}, fmt.Errorf("%w: unsupported priority", ErrInvalid)
		}
		fields["priority"] = *input.Priority
	}
	if len(fields) == 0 {
		return models.Todo{}, fmt.Errorf("%w: provide title, status, or priority", ErrInvalid)
	}
	todo, err := s.todos.Update(id, fields)
	if errors.Is(err, repository.ErrNotFound) {
		return models.Todo{}, ErrNotFound
	}
	return todo, err
}

func (s *TodoService) Delete(id uint) error {
	err := s.todos.Delete(id)
	if errors.Is(err, repository.ErrNotFound) {
		return ErrNotFound
	}
	return err
}

func validStatus(status string) bool {
	return status == models.StatusPending || status == models.StatusInProgress || status == models.StatusCompleted
}

func validPriority(priority string) bool {
	return priority == models.PriorityLow || priority == models.PriorityMedium || priority == models.PriorityHigh
}
