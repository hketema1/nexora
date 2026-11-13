# INST347 Week 11 — handoff

## Status at branch creation
- Repository: hketema1/nexora
- Week 11 starter branch: lab/week11-counter
- Azure resource group: nexora-rg
- GitHub collaborator and Azure role-assignment screenshots supplied by the team lead
- Creating or modifying Azure resources is **not** done by this GitHub staging commit
- The instructor's counter files are staged in frontend/ and api/ on the isolated branch; existing React frontend and FastAPI backend remain on main

## Team access and resources
- Azure host: Hawareyawe Ketema, inherited subscription Owner role
- Abdullah Shirzoi, Yerenmy Zelaya, Ehimhen Okojie: Contributor on nexora-rg
- Have different teammates create Cosmos DB for NoSQL, Function App Node 22 / Functions v4, and App Service Linux Node 22 / F1 if available; document who did which
- Check Azure for Students support, SKU availability, and pricing before provisioning

## Integration and rollout
1. Inspect the lab branch against main before any merge. **It replaces frontend/index.html and frontend/package.json only on this branch** and adds frontend/server.js and api/.
2. Choose a temporary main-branch lab deployment window with the team, or keep a separate demo repository if preserving Nexora main is essential. The lab grades pushes to main.
3. Deploy from Azure Deployment Center using GitHub Actions and user-assigned identity; avoid publish-profile/basic auth.
4. Correct generated workflows to use frontend/ and api/ for both build/deploy paths and push path filters; keep workflow_dispatch.
5. Add Web App API_BASE, Function App CosmosDBConnection, and Function App CORS origin in Azure (never GitHub source).
6. Confirm the web page displays count, Add 1 increments, and refresh retains count.
7. Each teammate makes their own frontend/index.html name commit from their own account; confirm only frontend workflow runs. One person changes api/src/version.js and confirms only API workflow runs.
8. Complete ELMS screenshot document: team+host, GitHub/Azure access, three resources, failed+successful workflows, live app URL+names, individual commit and workflow, setup diagram, reflection.

## Safety
- Never expose any Cosmos DB connection string, keys or secrets in screenshots or Git.
- The counter functions have anonymous HTTP access and are demonstration-only. Do not store real financial information.
- Existing React CI workflow may need adjustment when temporarily using the instructor's frontend package. It currently expects npm test and npm run build; the starter defines only npm start.
