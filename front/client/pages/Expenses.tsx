import MainLayout from "@/components/MainLayout";
import ModuleBlock from "@/components/ModuleBlock";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessModule } from "@/lib/modules";
import { useExpenses, useCreateExpense, Expense } from "@/hooks/useExpenses";
import { useState } from "react";

export default function Expenses() {
  const { user } = useAuth();
  const access = canAccessModule(user, "core_financial");
  const { data: expenses, isLoading } = useExpenses();
  const createExpense = useCreateExpense();

  const [formData, setFormData] = useState({
    value: '',
    category: 'Alimentação',
    payment_method: 'Débito',
    installments: '1',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense.mutateAsync({
        value: parseFloat(formData.value),
        category: formData.category,
        payment_method: formData.payment_method,
        installments: parseInt(formData.installments),
        date: formData.date,
        description: formData.description,
      });
      // Reset form
      setFormData({
        value: '',
        category: 'Alimentação',
        payment_method: 'Débito',
        installments: '1',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (error) {
      console.error('Erro ao criar gasto:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!access.accessible) {
    return (
      <ModuleBlock
        moduleName="Controle de Gastos"
        reason={access.reason}
        description="Adicione, acompanhe e organize seus gastos."
      />
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Gastos</h1>
          <p className="text-muted-foreground mt-1">
            Adicione, acompanhe e organize seus gastos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Novo Gasto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Alimentação</option>
                  <option>Aluguel</option>
                  <option>Transporte</option>
                  <option>Lazer</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Forma de Pagamento
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Débito</option>
                  <option>Crédito</option>
                  <option>Dinheiro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Parcelas
                </label>
                <input
                  type="number"
                  name="installments"
                  value={formData.installments}
                  onChange={handleInputChange}
                  placeholder="1"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrição detalhada do gasto"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={createExpense.isPending}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                {createExpense.isPending ? 'Adicionando...' : 'Adicionar Gasto'}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Seus Gastos
            </h2>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando gastos...</p>
              </div>
            ) : expenses && expenses.length > 0 ? (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{expense.description}</h3>
                        <p className="text-sm text-muted-foreground">{expense.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString('pt-BR')} • {expense.payment_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          R$ {expense.value.toFixed(2)}
                        </p>
                        {expense.installments > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {expense.installments}x
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum gasto registrado ainda. Adicione um gasto no formulário para começar!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
