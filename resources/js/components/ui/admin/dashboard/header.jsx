import { useState, useEffect } from 'react';

export default function Header({ user }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <header className="mb-12 transition-all duration-300">
            <div className="flex justify-between items-end">
                <div className="group">
                    <h1 className="text-5xl font-bold text-blue-900 mb-2 tracking-tight hover:tracking-wide transition-all duration-300">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg font-medium tracking-wide relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-0 before:h-[1px] before:bg-gray-400 group-hover:before:w-full before:transition-all before:duration-300">
                        Selamat datang kembali, <span className='text-purple-600'>{user?.name || 'Admin'}</span>
                    </p>
                </div>
                <div className="bg-white to-purple-50/30 px-6 py-3 rounded-lg hover:bg-white hover:shadow-sm shadow-purple-100 transition-all duration-300 border border-purple-100">
                    <p className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors text-right mt-1">
                        {time.toLocaleTimeString('id-ID')}
                    </p>
                </div>
            </div>
        </header>
    );
}
