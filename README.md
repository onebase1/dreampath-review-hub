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


                                             CURRENT N8N WORKFLOW -- NEEDS UPDATING



{
  "name": "Phase 2 Chatbot",
  "nodes": [
    {
      "parameters": {
        "promptType": "define",
        "text": "=Answer the following question about the website {{$json.websiteUrl || $json.website || \"the website\"}}:\n\nUser question: {{$json.question || $json.message || $json.input || \"Tell me about this website\"}}\n\n",
        "options": {
          "systemMessage": "=You are an AI assistant that provides information about specific websites based on their content. You only provide information that is directly found in the context provided to you - never make up information.\n\nYour responses should:\n1. Be concise and directly address the user's question\n2. Only use information from the context provided\n3. Include attribution like \"Based on the website content...\"\n4. If you don't know the answer, say \"I don't see information about that in the website content\" rather than making something up\n\nImportant guidelines:\n- Never claim to be the website or company - you are an AI assistant providing information about the website\n- If the context doesn't contain relevant information to answer the question, be honest about that limitation\n- Focus on providing factual information rather than opinions\n- Maintain a helpful, professional tone"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.9,
      "position": [
        320,
        -360
      ],
      "id": "cfc15508-94fc-4662-879d-6cc2c5263dc7",
      "name": "AI Agent"
    },
    {
      "parameters": {
        "model": "openai/gpt-4.1",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenRouter",
      "typeVersion": 1,
      "position": [
        -260,
        160
      ],
      "id": "0958345d-5b2d-4407-b697-08d615126133",
      "name": "OpenRouter Chat Model",
      "credentials": {
        "openRouterApi": {
          "id": "3gRwfSZx8LJpNoim",
          "name": "OpenRouterAPI"
        }
      }
    },
    {
      "parameters": {},
      "type": "@n8n/n8n-nodes-langchain.toolThink",
      "typeVersion": 1,
      "position": [
        100,
        160
      ],
      "id": "d8a8f8b0-a47c-4e4d-b293-57d71028e135",
      "name": "Think"
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "test"
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        -80,
        160
      ],
      "id": "b7e6f5a0-22b5-4e64-b4ea-221269dd1b7e",
      "name": "Simple Memory"
    },
    {
      "parameters": {
        "mode": "retrieve-as-tool",
        "toolName": "Knowledge_tool",
        "toolDescription": "Call to get the context and long term memory to answer queries from  chat faqs",
        "tableName": {
          "__rl": true,
          "value": "documents",
          "mode": "list",
          "cachedResultName": "documents"
        },
        "topK": 10,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
      "typeVersion": 1.1,
      "position": [
        460,
        160
      ],
      "id": "bdf924ed-2433-401c-bbc4-d5a6bdcaaa2c",
      "name": "Knowledge Tool",
      "credentials": {
        "supabaseApi": {
          "id": "qkWejdXq5ormiqmR",
          "name": "LiveChatZaraSuperBase"
        }
      }
    },
    {
      "parameters": {
        "content": "# Chat interface Agentn - potentially not required since data is in Database\n",
        "height": 1340,
        "width": 1720,
        "color": 5
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -740,
        -620
      ],
      "id": "d4434c8a-a04c-4ef9-8917-4bad88125d75",
      "name": "Sticky Note1",
      "disabled": true
    },
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
      "name": "Webhook",
      "webhookId": "51b63a7b-bd41-4564-9257-99ff48076636",
      "disabled": true
    },
    {
      "parameters": {
        "jsCode": "// Get input from chat trigger\nconst input = $input.first().json || {};\nconst message = input.message || input.input || input.text || \"\";\nlet websiteUrl = \"\";\n\n// Check if message is setting website URL\nif (message && message.toLowerCase().indexOf('website:') === 0) {\n  // Extract website URL\n  websiteUrl = message.substring(message.indexOf(':') + 1).trim();\n  \n  // Return initial response\n  return {\n    json: {\n      response: `I'll answer questions about ${websiteUrl}. What would you like to know?`,\n      websiteUrl: websiteUrl,\n      isWebsiteSet: true\n    }\n  };\n} \n// Check if we have a question and a chatId parameter that might contain website\nelse if (message && input.chatId) {\n  // Try to extract website from chatId (if you're storing it there)\n  const parts = input.chatId.split('|');\n  if (parts.length > 1) {\n    websiteUrl = parts[1];\n  }\n  \n  // If we have a website, process as question\n  if (websiteUrl) {\n    return {\n      json: {\n        question: message,\n        websiteUrl: websiteUrl,\n        isQuestion: true\n      }\n    };\n  }\n}\n\n// Default case - prompt for website\nreturn {\n  json: {\n    response: \"Please start by telling me which website you want to chat about. Format: 'website: https://example.com'\",\n    isWebsiteSet: false\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -180,
        -360
      ],
      "id": "829fc74d-5932-42d1-ae52-35e4db6dd615",
      "name": "Code"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1.2,
      "position": [
        560,
        380
      ],
      "id": "53ff119d-532b-4bd8-957f-6b25043393bb",
      "name": "Embeddings OpenAI",
      "credentials": {
        "openAiApi": {
          "id": "6F3QRMbNpK4b5kbD",
          "name": "OpenAiMCP Docker"
        }
      }
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "mode": "list",
          "value": "gpt-4o-mini"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [
        -240,
        -140
      ],
      "id": "a97028a6-30d0-4ba6-a2b6-da35252a28c3",
      "name": "OpenAI Chat Model1",
      "credentials": {
        "openAiApi": {
          "id": "6F3QRMbNpK4b5kbD",
          "name": "OpenAiMCP Docker"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.2,
      "position": [
        680,
        -360
      ],
      "id": "3f6204c9-7857-44a4-8137-3541690f0dd9",
      "name": "Respond to Webhook"
    }
  ],
  "pinData": {},
  "connections": {
    "OpenRouter Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Think": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Simple Memory": {
      "ai_memory": [
        [
          {
            "node": "AI Agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Knowledge Tool": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Webhook": {
      "main": [
        [
          {
            "node": "Code",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code": {
      "main": [
        [
          {
            "node": "AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Embeddings OpenAI": {
      "ai_embedding": [
        [
          {
            "node": "Knowledge Tool",
            "type": "ai_embedding",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent": {
      "main": [
        [
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
  },
  "versionId": "b9c962ef-8b4a-43e3-a2d3-f980029d6e77",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "51af8bffc3aa0c13c415e83528b3d07b48504ee1cffad0a6bbed7158e1feeb71"
  },
  "id": "tNJryvO2vYUEJX5H",
  "tags": []
}
