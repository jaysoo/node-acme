import { join } from 'node:path';
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createProjectGraphAsync, readJsonFile, workspaceRoot } from '@nx/devkit';

const projectPath = process.argv[2];

if (!projectPath) throw new Error('Provide a project path');

const packageJsonPath = join(workspaceRoot, projectPath, 'package.json');
if (!existsSync(packageJsonPath)) throw new Error(`${packageJsonPath} does not exist`);
const rootPackageJson = readJsonFile(packageJsonPath);
mkdirSync(join(workspaceRoot, projectPath, 'dist/workspace_modules'), { recursive: true });

const packageJson = readJsonFile(packageJsonPath);
const graph = await createProjectGraphAsync();

for (const [key, value] of Object.entries(packageJson.dependencies)) {
  if (value.startsWith('workspace:')) {
    // copy the _built_ project to dist/workspace_modules of the app
    const proj = graph.nodes[key];
    const root = proj.data.root;
    const packageJson = readJsonFile(join(workspaceRoot, root, 'package.json'));
    const npmPath = join(workspaceRoot, projectPath, 'dist/workspace_modules', packageJson.name);
    mkdirSync(npmPath, { recursive: true });
    cpSync(join(workspaceRoot, root), npmPath, {
      filter: (src) => !src.includes('node_modules'),
      recursive: true,
    });
    delete rootPackageJson.dependencies?.[key];
    delete rootPackageJson.devDependencies?.[key];
  }
}

writeFileSync(join(workspaceRoot, projectPath, 'dist/package.json'), JSON.stringify(rootPackageJson, null, 2));

process.exit(0);