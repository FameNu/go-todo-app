package service

import (
	"errors"
	"testing"

	"github.com/famenu/go-todo-app/api/internal/models"
	"github.com/famenu/go-todo-app/api/internal/repository"
)

type categoryStoreStub struct {
	exists bool
}

func (s categoryStoreStub) Create(*models.Category) error    { return nil }
func (s categoryStoreStub) List() ([]models.Category, error) { return nil, nil }
func (s categoryStoreStub) Exists(uint) (bool, error)        { return s.exists, nil }

type todoStoreStub struct{}

func (todoStoreStub) Create(*models.Todo) error                        { return nil }
func (todoStoreStub) List(string, *uint) ([]models.Todo, error)        { return nil, nil }
func (todoStoreStub) Get(uint) (models.Todo, error)                    { return models.Todo{}, nil }
func (todoStoreStub) Update(uint, map[string]any) (models.Todo, error) { return models.Todo{}, nil }
func (todoStoreStub) Delete(uint) error                                { return nil }

func TestCreateRequiresExistingCategory(t *testing.T) {
	service := NewTodoService(todoStoreStub{}, categoryStoreStub{exists: false})
	_, err := service.Create(CreateTodoInput{Title: "Call patient", CategoryID: 12})
	if !errors.Is(err, ErrInvalid) {
		t.Fatalf("expected invalid request error, got %v", err)
	}
}

func TestUpdateRejectsUnsupportedStatus(t *testing.T) {
	service := NewTodoService(todoStoreStub{}, categoryStoreStub{exists: true})
	status := "blocked"
	_, err := service.Update(1, UpdateTodoInput{Status: &status})
	if !errors.Is(err, ErrInvalid) {
		t.Fatalf("expected invalid request error, got %v", err)
	}
}

func TestGetMapsRepositoryNotFound(t *testing.T) {
	service := NewTodoService(todoMissingStore{}, categoryStoreStub{})
	_, err := service.Get(42)
	if !errors.Is(err, ErrNotFound) {
		t.Fatalf("expected service not found error, got %v", err)
	}
}

type todoMissingStore struct{ todoStoreStub }

func (todoMissingStore) Get(uint) (models.Todo, error) { return models.Todo{}, repository.ErrNotFound }
