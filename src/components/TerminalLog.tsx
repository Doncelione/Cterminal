'use client'

interface TerminalLogProps {
  logs: string[]
}

export function TerminalLog({ logs }: TerminalLogProps) {
  const handleClear = () => {
    // This would need to be implemented with a callback
  }

  return (
    <div className="terminal-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-terminal-yellow">📟 TERMINAL LOG</h2>
        <button
          onClick={handleClear}
          className="text-xs px-2 py-1 border border-terminal-gray text-terminal-gray hover:border-terminal-orange"
        >
          CLEAR LOG
        </button>
      </div>

      <div className="bg-terminal-bg h-48 overflow-y-auto p-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-terminal-gray">
            <div>[SYSTEM] Waiting for activity...</div>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.includes('ERROR') ? 'text-red-500' :
                log.includes('BUY') ? 'text-terminal-green' :
                log.includes('SELL') ? 'text-terminal-orange' :
                log.includes('Connected') ? 'text-terminal-cyan' :
                'text-terminal-gray'
              }`}
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
