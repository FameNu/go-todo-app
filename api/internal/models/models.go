package models

import "time"

const (
	StatusPending    = "pending"
	StatusInProgress = "in_progress"
	StatusCompleted  = "completed"

	PriorityLow    = "low"
	PriorityMedium = "medium"
	PriorityHigh   = "high"
)

type Category struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null;uniqueIndex"`
	Color     string    `json:"color" gorm:"not null;default:#3B82F6"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Todo struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	Title       string     `json:"title" gorm:"not null"`
	Description string     `json:"description" gorm:"type:text"`
	Status      string     `json:"status" gorm:"not null;default:pending"`
	Priority    string     `json:"priority" gorm:"not null;default:medium"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  uint       `json:"category_id" gorm:"not null;index"`
	Category    Category   `json:"category" gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
