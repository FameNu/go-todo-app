package handler

import (
	"errors"
	"strconv"

	"github.com/famenu/go-todo-app/api/internal/service"
	"github.com/gofiber/fiber/v2"
)

func createTodo(todos *service.TodoService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request service.CreateTodoInput
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid JSON body"})
		}
		todo, err := todos.Create(request)
		if err != nil {
			return respondError(c, err)
		}
		return c.Status(fiber.StatusCreated).JSON(todo)
	}
}

func listTodos(todos *service.TodoService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var categoryID *uint
		if raw := c.Query("category_id"); raw != "" {
			parsed, err := strconv.ParseUint(raw, 10, 32)
			if err != nil || parsed == 0 {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "category_id must be a positive integer"})
			}
			value := uint(parsed)
			categoryID = &value
		}
		result, err := todos.List(c.Query("status"), categoryID)
		if err != nil {
			return respondError(c, err)
		}
		return c.JSON(result)
	}
}

func getTodo(todos *service.TodoService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := parseID(c)
		if err != nil {
			return err
		}
		todo, err := todos.Get(id)
		if err != nil {
			return respondError(c, err)
		}
		return c.JSON(todo)
	}
}

func updateTodo(todos *service.TodoService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := parseID(c)
		if err != nil {
			return err
		}
		var request service.UpdateTodoInput
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid JSON body"})
		}
		todo, err := todos.Update(id, request)
		if err != nil {
			return respondError(c, err)
		}
		return c.JSON(todo)
	}
}

func deleteTodo(todos *service.TodoService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := parseID(c)
		if err != nil {
			return err
		}
		if err := todos.Delete(id); err != nil {
			return respondError(c, err)
		}
		return c.SendStatus(fiber.StatusNoContent)
	}
}

func parseID(c *fiber.Ctx) (uint, error) {
	parsed, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil || parsed == 0 {
		return 0, c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "id must be a positive integer"})
	}
	return uint(parsed), nil
}

func respondError(c *fiber.Ctx, err error) error {
	switch {
	case errors.Is(err, service.ErrInvalid):
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	case errors.Is(err, service.ErrNotFound):
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "resource not found"})
	case errors.Is(err, service.ErrConflict):
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": err.Error()})
	default:
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal server error"})
	}
}
