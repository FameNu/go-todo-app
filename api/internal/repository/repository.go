package repository

import (
	"github.com/famenu/go-todo-app/api/internal/models"
	"gorm.io/gorm"
)

var ErrNotFound = gorm.ErrRecordNotFound

type CategoryStore interface {
	Create(category *models.Category) error
	List() ([]models.Category, error)
	Exists(id uint) (bool, error)
}

type TodoStore interface {
	Create(todo *models.Todo) error
	List(status string, categoryID *uint) ([]models.Todo, error)
	Get(id uint) (models.Todo, error)
	Update(id uint, fields map[string]any) (models.Todo, error)
	Delete(id uint) error
}

type CategoryRepository struct{ db *gorm.DB }

func NewCategoryRepository(db *gorm.DB) *CategoryRepository { return &CategoryRepository{db: db} }

func (r *CategoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) List() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Order("name ASC").Find(&categories).Error
	return categories, err
}

func (r *CategoryRepository) Exists(id uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Category{}).Where("id = ?", id).Count(&count).Error
	return count > 0, err
}

type TodoRepository struct{ db *gorm.DB }

func NewTodoRepository(db *gorm.DB) *TodoRepository { return &TodoRepository{db: db} }

func (r *TodoRepository) Create(todo *models.Todo) error {
	return r.db.Create(todo).Error
}

func (r *TodoRepository) List(status string, categoryID *uint) ([]models.Todo, error) {
	query := r.db.Preload("Category").Order("created_at DESC")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if categoryID != nil {
		query = query.Where("category_id = ?", *categoryID)
	}
	var todos []models.Todo
	err := query.Find(&todos).Error
	return todos, err
}

func (r *TodoRepository) Get(id uint) (models.Todo, error) {
	var todo models.Todo
	err := r.db.Preload("Category").First(&todo, id).Error
	return todo, err
}

func (r *TodoRepository) Update(id uint, fields map[string]any) (models.Todo, error) {
	var todo models.Todo
	result := r.db.Model(&todo).Where("id = ?", id).Updates(fields)
	if result.Error != nil {
		return todo, result.Error
	}
	if result.RowsAffected == 0 {
		return todo, ErrNotFound
	}
	return r.Get(id)
}

func (r *TodoRepository) Delete(id uint) error {
	result := r.db.Delete(&models.Todo{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
