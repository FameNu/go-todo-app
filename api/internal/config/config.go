package config

import (
	"fmt"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/famenu/go-todo-app/api/internal/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Config contains runtime settings. DATABASE_URL takes precedence over DB_* values.
type Config struct {
	DatabaseURL    string
	DBHost         string
	DBUser         string
	DBPassword     string
	DBName         string
	DBPort         string
	Port           string
	AllowedOrigins string
}

func Load() (Config, error) {
	// Local runs may start from either the repository root or api/.
	if err := loadDotEnv(); err != nil {
		return Config{}, fmt.Errorf("load environment file: %w", err)
	}

	cfg := Config{
		DatabaseURL:    strings.TrimSpace(os.Getenv("DATABASE_URL")),
		DBHost:         os.Getenv("DB_HOST"),
		DBUser:         os.Getenv("DB_USER"),
		DBPassword:     os.Getenv("DB_PASSWORD"),
		DBName:         os.Getenv("DB_NAME"),
		DBPort:         os.Getenv("DB_PORT"),
		Port:           envOr("PORT", "8080"),
		AllowedOrigins: envOr("ALLOWED_ORIGINS", "*"),
	}
	if cfg.DatabaseURL == "" && (cfg.DBHost == "" || cfg.DBUser == "" || cfg.DBName == "") {
		return Config{}, fmt.Errorf("set DATABASE_URL or DB_HOST, DB_USER, and DB_NAME")
	}
	if cfg.DBPort == "" {
		cfg.DBPort = "5432"
	}
	return cfg, nil
}

func loadDotEnv() error {
	// A missing .env is normal in hosted environments where variables are injected.
	for _, path := range []string{".env", "../.env"} {
		if _, err := os.Stat(path); err == nil {
			return godotenv.Load(path)
		} else if !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func OpenDatabase(cfg Config) (*gorm.DB, error) {
	dsn := cfg.DatabaseURL
	if dsn == "" {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
			quoteDSN(cfg.DBHost), quoteDSN(cfg.DBUser), quoteDSN(cfg.DBPassword),
			quoteDSN(cfg.DBName), quoteDSN(cfg.DBPort))
	} else {
		// Render and Supabase commonly provide postgres:// URLs; GORM accepts the URL form.
		parsed, err := url.Parse(dsn)
		if err != nil || (parsed.Scheme != "postgres" && parsed.Scheme != "postgresql") {
			return nil, fmt.Errorf("DATABASE_URL must be a valid postgres URL")
		}
	}

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("open PostgreSQL connection: %w", err)
	}

	// Keep each API instance within a conservative connection budget for hosted poolers.
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("get PostgreSQL connection pool: %w", err)
	}
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Hour)

	if err := db.AutoMigrate(&models.Category{}, &models.Todo{}); err != nil {
		return nil, fmt.Errorf("migrate database schema: %w", err)
	}
	return db, nil
}

func envOr(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

// quoteDSN quotes values so spaces or special characters remain valid in keyword DSNs.
func quoteDSN(value string) string {
	return "'" + strings.ReplaceAll(strings.ReplaceAll(value, `\`, `\\`), `'`, `\'`) + "'"
}
