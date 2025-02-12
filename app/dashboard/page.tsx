import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="bg-dashboard-light-sidebar dark:bg-dashboard-dark-sidebar p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-dashboard-light-text dark:text-dashboard-dark-text">
          Welcome to Your Dashboard
        </h1>
        <p className="text-dashboard-light-muted dark:text-dashboard-dark-muted">
          Here you can manage your digital legacies and account settings.
        </p>
      </div>
    </DashboardLayout>
  )
}

