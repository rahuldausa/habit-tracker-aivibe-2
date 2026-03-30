import { useState } from 'react';
import { LuMinusCircle, LuPlusCircle } from 'lucide-react';

function CounterPage() {
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('counter') || '0', 10));

  React.useEffect(() => {
    localStorage.setItem('counter', count.toString());
  }, [count]);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(prevCount => Math.max(0, prevCount - 1));
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Counter App</h1>
      <div className="mt-10">
        <button onClick={decrement} disabled={count === 0} className="px-4 py-2 mr-4 bg-gray-300 rounded hover:bg-gray-400">
          <LuMinusCircle strokeWidth={2.5} />
        </button>
        <span className="text-5xl font-bold">{count}</span>
        <button onClick={increment} className="px-4 py-2 ml-4 bg-gray-300 rounded hover:bg-gray-400">
          <LuPlusCircle strokeWidth={2.5} />
        </button>
      </div>
      <button onClick={reset} className="mt-10 px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600">
        Reset
      </button>
    </div>
  );
}

export default CounterPage;