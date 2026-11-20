package main

import (
	"log"
	"os"

	"github.com/famenu/go-todo-app/api/internal/config"
	"github.com/famenu/go-todo-app/api/internal/handler"
	"github.com/famenu/go-todo-app/api/internal/repository"
	"github.com/famenu/go-todo-app/api/internal/service"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load configuration: %v", err)
	}

	db, err := config.OpenDatabase(cfg)
	if err != nil {
		log.Fatalf("connect to database: %v", err)
	}

	categoryRepo := repository.NewCategoryRepository(db)
	todoRepo := repository.NewTodoRepository(db)
	categoryService := service.NewCategoryService(categoryRepo)
	todoService := service.NewTodoService(todoRepo, categoryRepo)
	app := handler.NewRouter(cfg.AllowedOrigins, db, categoryService, todoService)

	// An empty host binds on all interfaces, as required by Render and Docker.
	addr := ":" + cfg.Port
	if err := app.Listen(addr); err != nil {
		log.Printf("server stopped: %v", err)
		os.Exit(1)
	}
}
