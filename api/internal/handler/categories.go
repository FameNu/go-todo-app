package handler

import (
	"github.com/famenu/go-todo-app/api/internal/service"
	"github.com/gofiber/fiber/v2"
)

type categoryRequest struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

func createCategory(categories *service.CategoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request categoryRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid JSON body"})
		}
		category, err := categories.Create(request.Name, request.Color)
		if err != nil {
			return respondError(c, err)
		}
		return c.Status(fiber.StatusCreated).JSON(category)
	}
}

func listCategories(categories *service.CategoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		result, err := categories.List()
		if err != nil {
			return respondError(c, err)
		}
		return c.JSON(result)
	}
}
