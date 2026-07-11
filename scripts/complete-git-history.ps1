# Complete remaining TDD commits from auth implementation forward
$git = "C:\Program Files\Git\bin\git.exe"
$root = "C:\Users\HP\car-dealership-system"
Set-Location $root

$coAuthor = "`n`nCo-authored-by: Cursor AI <AI@users.noreply.github.com>"

function Invoke-GitCommit {
    param([string]$Message)
    & $git commit -m ($Message + $coAuthor)
    if ($LASTEXITCODE -ne 0) { throw "Commit failed: $Message" }
}

# --- Vehicle tests (RED) ---
@'
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await User.deleteMany({});
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await disconnectDatabase();
});
'@ | Set-Content -Path "backend\src\tests\jest.setup.afterEnv.ts" -Encoding utf8

& $git add backend/src/tests/vehicle.test.ts backend/src/tests/helpers/auth.helper.ts backend/src/tests/jest.setup.afterEnv.ts
Invoke-GitCommit "test(vehicles): add vehicle CRUD and search test suite"

# --- Vehicle CRUD (GREEN) ---
@'
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Car Dealership API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(errorMiddleware);

export default app;
'@ | Set-Content -Path "backend\src\app.ts" -Encoding utf8

& $git add backend/src/models/vehicle.model.ts backend/src/repositories/vehicle.repository.ts backend/src/services/vehicle.service.ts backend/src/controllers/vehicle.controller.ts backend/src/routes/vehicle.routes.ts backend/src/utils/params.util.ts backend/src/app.ts
Invoke-GitCommit "feat(vehicles): implement vehicle CRUD and search APIs"

# --- Inventory tests (RED) ---
& $git add backend/src/tests/inventory.test.ts
Invoke-GitCommit "test(inventory): add purchase and restock test suite"

# --- Inventory (GREEN) ---
& $git add backend/src/services/inventory.service.ts backend/src/controllers/inventory.controller.ts
Invoke-GitCommit "feat(inventory): implement purchase and restock APIs"

# --- Frontend scaffold ---
& $git add frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/.gitignore frontend/.oxlintrc.json frontend/index.html frontend/vite.config.ts frontend/src/main.tsx frontend/src/index.css frontend/src/assets frontend/public
Invoke-GitCommit "feat(frontend): scaffold React Vite Tailwind project"

# --- API + auth context ---
& $git add frontend/src/api frontend/src/types frontend/src/context frontend/src/components/Toast.tsx frontend/.env.example
Invoke-GitCommit "feat(frontend): add API layer and authentication context"

# --- Auth UI ---
& $git add frontend/src/pages/Login.tsx frontend/src/pages/Register.tsx frontend/src/components/ProtectedRoute.tsx frontend/src/components/AdminRoute.tsx frontend/src/components/Loader.tsx frontend/src/components/Navbar.tsx frontend/src/components/Footer.tsx frontend/src/layouts frontend/src/routes frontend/src/App.tsx
Invoke-GitCommit "feat(frontend): add authentication pages and route guards"

# --- Dashboard + search ---
& $git add frontend/src/pages/Dashboard.tsx frontend/src/pages/Search.tsx frontend/src/pages/VehicleDetails.tsx frontend/src/pages/NotFound.tsx frontend/src/components/VehicleCard.tsx frontend/src/components/VehicleList.tsx frontend/src/components/SearchBar.tsx frontend/src/components/Pagination.tsx frontend/src/utils
Invoke-GitCommit "feat(frontend): add vehicle dashboard, search, and details pages"

# --- Admin UI ---
& $git add frontend/src/pages/AdminDashboard.tsx frontend/src/pages/AddVehicle.tsx frontend/src/pages/EditVehicle.tsx frontend/src/components/VehicleForm.tsx
Invoke-GitCommit "feat(frontend): add admin vehicle management UI"

# --- Deployment ---
@'
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';

const app: Application = express();

const corsOptions = env.frontendUrl
  ? { origin: env.frontendUrl, credentials: true }
  : undefined;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Car Dealership API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(errorMiddleware);

export default app;
'@ | Set-Content -Path "backend\src\app.ts" -Encoding utf8

& $git add render.yaml frontend/vercel.json backend/src/config/env.ts backend/src/app.ts backend/.env.example backend/package.json
Invoke-GitCommit "chore: add deployment configuration for Render and Vercel"

# --- Full README ---
Copy-Item -Path "scripts\README.full.md" -Destination "README.md" -Force
& $git add README.md scripts/
Invoke-GitCommit "docs: complete README with deployment guide, test report, and AI usage"

Write-Host "`n=== Git History ==="
& $git log --oneline
