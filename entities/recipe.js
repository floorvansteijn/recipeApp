{
  "name": "Recipe",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Recipe name"
    },
    "description": {
      "type": "string",
      "description": "Brief summary of the recipe"
    },
    "image_url": {
      "type": "string",
      "description": "URL of the recipe photo"
    },
    "cuisine": {
      "type": "string",
      "description": "Cuisine type (e.g. Lebanese, Chinese)"
    },
    "protein_type": {
      "type": "string",
      "enum": [
        "chicken",
        "fish",
        "beef",
        "vegetarian",
        "pork",
        "lamb",
        "other"
      ],
      "description": "Main protein type"
    },
    "cooking_time": {
      "type": "number",
      "description": "Cooking time in minutes"
    },
    "portions": {
      "type": "number",
      "description": "Number of portions"
    },
    "ingredients": {
      "type": "array",
      "description": "List of ingredients",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "amount": {
            "type": "string"
          },
          "notes": {
            "type": "string"
          }
        }
      }
    },
    "steps": {
      "type": "array",
      "description": "Cooking steps",
      "items": {
        "type": "object",
        "properties": {
          "instruction": {
            "type": "string"
          },
          "duration_minutes": {
            "type": "number"
          },
          "help_images": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "image_url": {
                  "type": "string"
                },
                "caption": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags like Quick, Breakfast, etc."
    },
    "is_saved": {
      "type": "boolean",
      "default": false,
      "description": "Whether this is a user-saved custom recipe"
    },
    "original_recipe_id": {
      "type": "string",
      "description": "ID of the original recipe if this is a modified version"
    },
    "modifications": {
      "type": "array",
      "description": "List of modifications made",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "swap",
              "addition",
              "removal"
            ]
          },
          "original": {
            "type": "string"
          },
          "replacement": {
            "type": "string"
          },
          "amount": {
            "type": "string"
          }
        }
      }
    },
    "user_notes": {
      "type": "string",
      "description": "User feedback/notes about the recipe"
    }
  },
  "required": [
    "title"
  ]
}