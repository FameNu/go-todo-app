package handler

import (
	"errors"
	"strings"

	"github.com/famenu/go-todo-app/api/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/gorm"
)

func NewRouter(allowedOrigins string, db *gorm.DB, categories *service.CategoryService, todos *service.TodoService) *fiber.App {
	app := fiber.New(fiber.Config{AppName: "Clinic Todo API", ErrorHandler: errorHandler})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{AllowOrigins: strings.TrimSpace(allowedOrigins), AllowMethods: "GET,POST,PATCH,DELETE,OPTIONS", AllowHeaders: "Origin,Content-Type,Accept"}))
	api := app.Group("/api/v1")
	app.Get("/health", health(db))
	api.Get("/health", health(db))
	api.Post("/categories", createCategory(categories))
	api.Get("/categories", listCategories(categories))
	api.Post("/todos", createTodo(todos))
	api.Get("/todos", listTodos(todos))
	api.Get("/todos/:id", getTodo(todos))
	api.Patch("/todos/:id", updateTodo(todos)) 
	api.Delete("/todos/:id", deleteTodo(todos))
	return app
}

func health(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		sqlDB, err := db.DB()
		if err != nil || sqlDB.PingContext(c.UserContext()) != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"status": "error", "database": "disconnected"})
		}
		return c.JSON(fiber.Map{"status": "ok", "database": "connected"})
	}
}

func errorHandler(c *fiber.Ctx, err error) error {
	status := fiber.StatusInternalServerError
	message := "internal server error"
	var fiberErr *fiber.Error
	if errors.As(err, &fiberErr) {
		status = fiberErr.Code
		message = fiberErr.Message
	}
	return c.Status(status).JSON(fiber.Map{"error": message})
}
