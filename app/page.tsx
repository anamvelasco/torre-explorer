import SearchBar from "@/components/SearchBar";
import { Card, CardPad } from "@/components/UI";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardPad>
          <h2 className="text-lg font-semibold mb-2">Buscar perfil por username</h2>
          <p className="text-sm opacity-70 mb-4">Ejemplo: rubenjr</p>
          <SearchBar />
        </CardPad>
      </Card>
      <Card>
        <CardPad>
          <h3 className="font-medium mb-2">Ejemplos rápidos</h3>
          <div className="flex flex-wrap gap-2">
            {["rubenjr", "guillermo", "veronica"].map((u) => (
              <a key={u} href={`/profile/${u}`} className="px-3 py-1 rounded-full border text-sm">
                {u}
              </a>
            ))}
          </div>
        </CardPad>
      </Card>
    </div>
  );
}
