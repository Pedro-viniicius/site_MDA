import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RecomendacaoAdminNaoEncontrada() {
  return (
    <div className="mx-auto max-w-md pt-16">
      <Card className="border-dashed text-center shadow-sm">
        <CardContent className="py-14">
          <SearchX aria-hidden className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-xl font-bold text-navy-900">
            Recomendação não encontrada
          </h1>
          <p className="mt-2 text-muted-foreground">
            Verifique o link ou consulte a lista de leads.
          </p>
          <Button render={<Link href="/admin/leads" />} variant="outline" className="mt-6">
            Voltar para leads
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
