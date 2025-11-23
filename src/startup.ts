import { appEvents } from "./events";
import { spawn } from "child_process";
import path from "path";

/**
 * Executa um script shell (cross-platform via shell) e resolve quando terminar.
 */
function runScript(scriptPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = spawn(scriptPath, { shell: true, stdio: "inherit" });

        proc.on("close", (code: number | null) => {
            if (code && code !== 0) {
                reject(new Error(`${scriptPath} finalizou com código ${code}`));
            } else {
                resolve();
            }
        });

        proc.on("error", (err: Error) => {
            reject(err);
        });
    });
}

appEvents.on("app:started", async () => {
    try {
        // eslint-disable-next-line no-console
        console.log("🔄 Executando seeds...");

        const projetoRoot = process.cwd();
        const scripts = [
            path.join(projetoRoot, "seed_products.sh"),
            path.join(projetoRoot, "seed_customers.sh"),
        ];

        // executa sequencialmente para evitar sobrecarga no servidor
        for (const s of scripts) {
            // eslint-disable-next-line no-console
            console.log(`➡ Executando ${s}`);
            await runScript(s);
        }
        // eslint-disable-next-line no-console
        console.log("✅ Seeds executados com sucesso");
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("❌ Erro ao executar seeds:", error);
    }
});
