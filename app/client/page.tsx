export default function ClientDashboardTest() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-white uppercase tracking-tight">
        Bun venit, Client! 👋
      </h1>
      <p className="text-zinc-400 text-sm font-medium">
        Aceasta este zona din centru care se va schimba dinamic. Meniul din stânga și cel de sus sunt fixe!
      </p>
      <div className="w-full h-64 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl flex items-center justify-center text-zinc-600 text-xs font-mono">
        [ Loc pentru graficele și tabelele din machetă ]
      </div>
    </div>
  );
}
