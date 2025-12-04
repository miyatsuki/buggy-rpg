import { useEffect, useRef } from 'react';
import type { BattleLogEntry } from '../../types';
import './BattleLog.css';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="battle-log">
      <h3>戦闘ログ</h3>
      <div className="battle-log-content">
        {logs.map((log) => (
          <div key={log.id} className={`log-entry log-${log.type}`}>
            {log.message}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
