import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { buildIcs, ICS_PATH } from './src/lib/calendar';

/** Serves a real .ics file (text/calendar) so iPhone/Outlook open their "Add to calendar" sheet. */
function calendarFile(): Plugin {
  return {
    name: 'wedding-calendar-file',
    configureServer(server) {
      server.middlewares.use(ICS_PATH, (_req, res) => {
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.end(buildIcs());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: ICS_PATH.slice(1), source: buildIcs() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), calendarFile()],
});
