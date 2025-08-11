import React from 'react'

/**
 * Accessible tabs component for view navigation
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects {id, label, content}
 * @param {string} props.activeTab - Currently active tab ID
 * @param {Function} props.onTabChange - Callback for tab changes
 * @param {string} props.className - Additional CSS classes
 */
export default function Tabs({
  tabs = [],
  activeTab,
  onTabChange = () => {},
  className = ''
}) {
  if (!tabs.length) return null

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Analytics Views">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              aria-hidden={!isActive}
              className={`${isActive ? 'block' : 'hidden'}`}
            >
              {tab.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}