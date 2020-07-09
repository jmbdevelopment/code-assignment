import React from 'react'

import AuthenticationChart from './AuthenticationChart'

const DashboardView = () => {
    return (
        <div className="dashboard-view">
            <div className="dashboard-view__heading">Dashboard</div>
            <div className="authentication-chart">
                <AuthenticationChart />
            </div>
        </div>
    )
}

export default DashboardView