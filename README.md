
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d211c3a5-7595-47a7-8510-b8495fbc8170

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d211c3a5-7595-47a7-8510-b8495fbc8170) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d211c3a5-7595-47a7-8510-b8495fbc8170) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)


                                             UPDATED N8N WORKFLOW


{
  "name": "Phase 2 Chatbot",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "/chat",
        "responseMode": "lastNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -500,
        -360
      ],
      "id": "957b62ad-3355-4491-818b-5349450f05e8",
      "name": "Chat Webhook",
      "webhookId": "51b63a7b-bd41-4564-9257-99ff48076636"
    },
    {
      "parameters": {
        "jsCode": "// Extract data from incoming webhook request\nconst input = $input.first().json || {};\nconst query = input.query || '';\nconst sessionId = input.sessionId || '';\nconst websiteUrl = input.websiteUrl || '';\n\nif (!query || !sessionId || !websiteUrl) {\n  return {\n    json: {\n      error: 'Missing required parameters: query, sessionId, or websiteUrl',\n    }\n  };\n}\n\nreturn {\n  json: {\n    query,\n    sessionId,\n    websiteUrl,\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -300,
        -360
      ],
      "id": "829fc74d-5932-42d1-ae52-35e4db6dd615",
      "name": "Validate Input"
    },
    {
      "parameters": {
        "operation": "createEmbedding",
        "model": "text-embedding-ada-002",
        "text": "={{ $json.query }}",
        "options": {}
      },
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        -100,
        -360
      ],
      "id": "4a5e1b2c-8d6f-4e9a-9c7b-f2a3b4d5e6f7",
      "name": "Generate Embedding",
      "credentials": {
        "openAiApi": {
          "id": "6F3QRMbNpK4b5kbD",
          "name": "OpenAiMCP Docker"
        }
      }
    },
    {
      "parameters": {
        "functionCode": "// Prepare parameters for vector search\nconst embedding = $input.first().json.data[0].embedding;\nconst websiteUrl = $input.first().json.websiteUrl;\nconst sessionId = $input.first().json.sessionId;\nconst query = $input.first().json.query;\n\nreturn {\n  json: {\n    embedding,\n    websiteUrl,\n    sessionId,\n    query,\n    match_threshold: 0.75,\n    match_count: 5\n  }\n};"
      },
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        100,
        -360
      ],
      "id": "6a7b8c9d-0e1f-2g3h-4i5j-6k7l8m9n0o1p",
      "name": "Prepare Search Query"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM match_documents(\n  $1::vector(1536),\n  $2::text,\n  $3::float,\n  $4::int\n);",
        "additionalFields": {
          "queryParams": "={{ [$json.embedding, $json.websiteUrl, $json.match_threshold, $json.match_count] }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [
        300,
        -360
      ],
      "id": "1q2r3s4t-5u6v-7w8x-9y0z-1a2b3c4d5e6f",
      "name": "Search Vector DB",
      "credentials": {
        "postgres": {
          "id": "qkWejdXq5ormiqmR",
          "name": "LiveChatZaraSuperBase"
        }
      }
    },
    {
      "parameters": {
        "functionCode": "// Check if we found relevant documents\nconst documents = $input.first().json;\nconst prevInput = $input.all()[1].json;\n\n// Get original query, sessionId and websiteUrl\nconst originalQuery = prevInput.query;\nconst sessionId = prevInput.sessionId;\nconst websiteUrl = prevInput.websiteUrl;\n\n// Prepare context from retrieved documents\nlet contextText = \"\";\nlet websiteTitle = websiteUrl;\n\nif (documents && documents.length > 0) {\n  contextText = documents.map(doc => doc.content).join(\"\\n\\n\");\n  \n  // Try to extract website title from metadata if available\n  if (documents[0].metadata && documents[0].metadata.website_title) {\n    websiteTitle = documents[0].metadata.website_title;\n  }\n}\n\nreturn {\n  json: {\n    query: originalQuery,\n    context: contextText,\n    documents: documents,\n    sessionId: sessionId,\n    websiteUrl: websiteUrl,\n    websiteTitle: websiteTitle,\n    hasRelevantContent: documents && documents.length > 0\n  }\n};"
      },
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        500,
        -360
      ],
      "id": "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
      "name": "Prepare Context"
    },
    {
      "parameters": {
        "operation": "completion",
        "model": "gpt-4o-mini",
        "prompt": "=You are a helpful assistant answering questions about the website \"{{ $json.websiteTitle }}\".\n\nUse ONLY the following information to answer the question:\n{{ $json.context }}\n\nIf the information is not in the text above, respond with \"I don't have that information from this website.\"\nAlways include the phrase \"According to {{ $json.websiteTitle }}\" in your answer.\n\nQuestion: {{ $json.query }}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        700,
        -360
      ],
      "id": "3w4x5y6z-7a8b-9c0d-1e2f-3g4h5i6j7k8l",
      "name": "Generate Answer",
      "credentials": {
        "openAiApi": {
          "id": "6F3QRMbNpK4b5kbD",
          "name": "OpenAiMCP Docker"
        }
      }
    },
    {
      "parameters": {
        "functionCode": "// Update user session and format final response\nconst responseData = $input.first().json;\nconst contextData = $input.all()[1].json;\n\nlet answer = \"I don't have enough information from this website to answer your question.\";\n\nif (contextData.hasRelevantContent && responseData.text) {\n  answer = responseData.text.trim();\n}\n\nconst sessionId = contextData.sessionId;\nconst websiteUrl = contextData.websiteUrl;\n\nreturn {\n  json: {\n    answer: answer,\n    sessionId: sessionId,\n    websiteUrl: websiteUrl,\n    relevantSources: contextData.documents ? contextData.documents.map(doc => ({\n      content: doc.content.substring(0, 100) + \"...\",\n      similarity: doc.similarity\n    })).slice(0, 3) : []\n  }\n};"
      },
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        900,
        -360
      ],
      "id": "9m0n1o2p-3q4r-5s6t-7u8v-9w0x1y2z3a4b",
      "name": "Format Response"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "-- Update user session with new question count\nUPDATE user_sessions\nSET questions_asked = questions_asked + 1,\n    last_active_at = NOW()\nWHERE session_id = $1::uuid\nRETURNING *;",
        "additionalFields": {
          "queryParams": "={{ [$json.sessionId] }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [
        1100,
        -200
      ],
      "id": "5c6d7e8f-9g0h-1i2j-3k4l-5m6n7o8p9q0r",
      "name": "Update Session",
      "credentials": {
        "postgres": {
          "id": "qkWejdXq5ormiqmR",
          "name": "LiveChatZaraSuperBase"
        }
      }
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        1100,
        -360
      ],
      "id": "3f6204c9-7857-44a4-8137-3541690f0dd9",
      "name": "Respond to Webhook"
    }
  ],
  "connections": {
    "Chat Webhook": {
      "main": [
        [
          {
            "node": "Validate Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Input": {
      "main": [
        [
          {
            "node": "Generate Embedding",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Embedding": {
      "main": [
        [
          {
            "node": "Prepare Search Query",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Search Query": {
      "main": [
        [
          {
            "node": "Search Vector DB",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Search Vector DB": {
      "main": [
        [
          {
            "node": "Prepare Context",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Context": {
      "main": [
        [
          {
            "node": "Generate Answer",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Answer": {
      "main": [
        [
          {
            "node": "Format Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Response": {
      "main": [
        [
          {
            "node": "Update Session",
            "type": "main",
            "index": 0
          },
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
  }
}

