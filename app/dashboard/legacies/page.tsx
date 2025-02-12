import DashboardLayout from "@/components/dashboard-layout"

export default function LegaciesPage() {
  return (
    <DashboardLayout>
      <div className="bg-dashboard-light-sidebar dark:bg-dashboard-dark-sidebar p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-dashboard-light-text dark:text-dashboard-dark-text">
          Your Legacies
        </h1>
        <p className="text-dashboard-light-muted dark:text-dashboard-dark-muted">Manage your digital legacies here.</p>
      </div>
    </DashboardLayout>
  )
}

