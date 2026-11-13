
# NEXORA
### Cloud-Based Personal Finance & Budgeting Application

INST347 – Cloud Computing | Fall 2026

## Project Overview
NEXORA is a cloud-based budgeting application designed
to help users track expenses, manage monthly budgets,
and visualize their spending habits.

## Core Features
- Transaction importing through Plaid Sandbox
- Spending categorization
- Monthly budgeting
- Interactive financial dashboard
- AI-assisted receipt processing

## Technology Stack
- Frontend: React
- Backend: Python / FastAPI
- Cloud Provider: Microsoft Azure
- Compute: Azure Container Apps
- Database: Azure Database for PostgreSQL
- Storage: Azure Blob Storage
- Automation: GitHub Actions
- External API: Plaid Sandbox

## Team Members
- Yerenmy Zelaya – Project Manager
- Hawareyawe Ketema – Technical Project Lead
- Abdullah Shirzoi – DevOps Lead
- Ehimhen Okojie – Documentation Lead

## Project Structure
- frontend/ – React user interface
- backend/ – FastAPI application
- database/ – PostgreSQL schema
- infrastructure/ – Azure configuration
- docs/ – Project documentation
- tests/ – Application tests

## Getting Started
Setup instructions will be added as the application
components are implemented and verified.

## Development Workflow
1. Create an Issue for each task.
2. Create a branch from main.
3. Develop and test changes.
4. Open a pull request.
5. Review and merge into main.

## Status
Development / Implementation Planning

-Yerenmy: testing commit.

## Week 11 Azure deployment lab (isolated branch)

This branch, `lab/week11-counter`, stages the professor's counter starter for the Week 11 infrastructure exercise. **Do not merge blindly**: this branch temporarily replaces the React entry point in `frontend/` with the instructor's counter page. The existing Nexora React/FastAPI product is preserved on `main` and in Git history.

### Our team
- Hawareyawe Ketema — Technical Project Lead; Azure host and GitHub repository owner
- Abdullah Shirzoi — DevOps Lead
- Yerenmy Zelaya — Project Manager
- Ehimhen Okojie — Documentation Lead

### Week 11 lab targets
- Resource group: `nexora-rg`
- Live website: **pending Web App creation**
- API: **pending Function App creation**
- Database: Azure Cosmos DB for NoSQL
- Web App app setting: `API_BASE` = Function App HTTPS URL ending in `/api`
- Function App app setting: `CosmosDBConnection` (secret; never commit)
- Function App CORS: add Web App HTTPS origin
- Pipeline: GitHub Actions from `main`, separate filters for `frontend/**` and `api/**`, identity-based GitHub-to-Azure authentication.

The starter contains `frontend/server.js` and `api/src/functions/`. Each teammate must edit `frontend/index.html` in **their own GitHub commit** after the pipelines are running. Do not include secrets in screenshots.

Once the lab is complete, deliberately restore/merge Nexora's React dashboard, reconnect the FastAPI backend to an Azure-supported hosting/database configuration, and revise the workflows. Do not treat Cosmos DB for NoSQL as a drop-in replacement for SQLAlchemy's SQLite/PostgreSQL database.
