import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, Trophy, Users, TrendingUp, Filter, Activity, Award, Target, FileDown } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const AdminReportsPage = () => {
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [exportYear, setExportYear] = useState<string | null>('all');
    const [exportCategory, setExportCategory] = useState<string>('all');
    const [exportLevel, setExportLevel] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    // Mock periods data similar to index.tsx
    const periods = [
        { id: 1, name: '2024' },
        { id: 2, name: '2023' },
        { id: 3, name: '2022' }
    ];

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/reports/data?year=${selectedYear}&category=${selectedCategory}&level=${selectedLevel}`);
            const data = await response.json();
            if (data.success) {
                setReportData(data.data);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [selectedYear, selectedCategory, selectedLevel]);

    // Mock data - replace with actual API calls
    const [reportData, setReportData] = useState({
        summary: {
            totalStudents: 1250,
            totalCompetitions: 85,
            totalAchievements: 156,
            winRate: 68.2
        },
        categoryStats: [
            { name: 'Programming', competitions: 25, wins: 18, students: 45 },
            { name: 'Design', competitions: 15, wins: 12, students: 28 },
            { name: 'Business', competitions: 20, wins: 14, students: 35 },
            { name: 'Research', competitions: 12, wins: 8, students: 22 },
            { name: 'Innovation', competitions: 13, wins: 9, students: 26 }
        ],
        levelDistribution: [
            { level: 'Internasional', count: 15, percentage: 18 },
            { level: 'Nasional', count: 32, percentage: 38 },
            { level: 'Regional', count: 28, percentage: 33 },
            { level: 'Lokal', count: 9, percentage: 11 }
        ],
        monthlyTrend: [
            { month: 'Jan', competitions: 8, achievements: 5 },
            { month: 'Feb', competitions: 12, achievements: 8 },
            { month: 'Mar', competitions: 15, achievements: 12 },
            { month: 'Apr', competitions: 10, achievements: 7 },
            { month: 'May', competitions: 18, achievements: 14 },
            { month: 'Jun', competitions: 22, achievements: 18 }
        ],
        topPerformers: [
            { name: 'Ahmad Fauzi', nim: '2021001', achievements: 5, categories: ['Programming', 'Innovation'] },
            { name: 'Sari Dewi', nim: '2021002', achievements: 4, categories: ['Design', 'Business'] },
            { name: 'Budi Santoso', nim: '2021003', achievements: 4, categories: ['Research', 'Programming'] },
            { name: 'Maya Sari', nim: '2021004', achievements: 3, categories: ['Business', 'Innovation'] },
            { name: 'Eko Prabowo', nim: '2021005', achievements: 3, categories: ['Programming', 'Design'] }
        ],
        recommendationStats: {
            totalRecommendations: 245,
            acceptedRecommendations: 167,
            successRate: 68.2,
            averageMatchScore: 7.8
        }
    });

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

    const handleExport = () => {
        setLoading(true);
        // Construct the export URL similar to index.tsx
        window.open(
            `/admin/reports/export?${new URLSearchParams({
                format: 'excel',
                year: exportYear === 'all' ? '' : exportYear,
                category: exportCategory,
                level: exportLevel
            }).toString()}`,
            '_blank'
        );
        setTimeout(() => setLoading(false), 2000);
    };

    // Reusable StatCard component inspired by index.tsx
    const StatCard = ({ title, value, icon: Icon, trend, color = "purple" }) => (
        <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '+' : ''}{trend}% dari bulan lalu
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-full bg-${color}-100`}>
                        <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Component for Top Performers inspired by ProfileCard/EventList
    const TopPerformersList = ({ performers, className = "" }) => (
        <Card className={`border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Top Performers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {performers.map((student, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50/30 rounded-lg hover:bg-purple-100/30 transition-all">
                            <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">NIM: {student.nim}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {student.categories.map((cat, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    <span className="font-semibold">{student.achievements}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    // Component for Recommendation Stats inspired by ProgramStudiList/PeriodList
    const RecommendationStatsList = ({ stats, className = "" }) => (
        <Card className={`border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Efektivitas Sistem Rekomendasi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Total Rekomendasi</span>
                            <span className="text-lg font-bold text-blue-600">{stats.totalRecommendations}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Rekomendasi Diterima</span>
                            <span className="text-lg font-bold text-green-600">{stats.acceptedRecommendations}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Tingkat Keberhasilan</span>
                            <span className="text-lg font-bold text-purple-600">{stats.successRate}%</span>
                        </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Skor Kecocokan Rata-rata</span>
                            <span className="text-lg font-bold text-orange-600">{stats.averageMatchScore}/10</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AdminLayout>
            <section className="mb-10">
                {/* Statistics cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    <StatCard
                        title="Total Mahasiswa Aktif"
                        value={reportData.summary.totalStudents.toLocaleString()}
                        icon={Users}
                        trend={8.5}
                    />
                    <StatCard
                        title="Total Kompetisi"
                        value={reportData.summary.totalCompetitions}
                        icon={Trophy}
                        trend={15.2}
                        color="green"
                    />
                    <StatCard
                        title="Total Prestasi"
                        value={reportData.summary.totalAchievements}
                        icon={Award}
                        trend={12.8}
                        color="purple"
                    />
                    <StatCard
                        title="Tingkat Keberhasilan"
                        value={`${reportData.summary.winRate}%`}
                        icon={Target}
                        trend={5.3}
                        color="orange"
                    />
                </div>
            </section>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Filter Controls */}
                <div className="lg:col-span-12">
                    <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Laporan Prestasi Mahasiswa
                            </CardTitle>
                            <p className="text-gray-600">Dashboard komprehensif untuk analisis prestasi dan efektivitas sistem</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Tahun Akademik</Label>
                                    <Select
                                        onValueChange={(value) => setSelectedYear(value)}
                                        value={selectedYear}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem key={period.id} value={period.name}>
                                                    {period.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Kategori Lomba</Label>
                                    <Select
                                        onValueChange={(value) => setSelectedCategory(value)}
                                        value={selectedCategory}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori</SelectItem>
                                            <SelectItem value="programming">Programming</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="research">Research</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Tingkat Kompetisi</Label>
                                    <Select
                                        onValueChange={(value) => setSelectedLevel(value)}
                                        value={selectedLevel}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tingkat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tingkat</SelectItem>
                                            <SelectItem value="5">Internasional</SelectItem>
                                            <SelectItem value="4">Nasional</SelectItem>
                                            <SelectItem value="3">Regional</SelectItem>
                                            <SelectItem value="2">Provinsi</SelectItem>
                                            <SelectItem value="1">Lokal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white" type="button">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Prestasi Berdasarkan Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.categoryStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="competitions" fill="#8884d8" name="Total Kompetisi" />
                                    <Bar dataKey="wins" fill="#82ca9d" name="Prestasi Diraih" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Tren Prestasi Bulanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reportData.monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="competitions" stroke="#8884d8" name="Kompetisi Diikuti" />
                                    <Line type="monotone" dataKey="achievements" stroke="#82ca9d" name="Prestasi Diraih" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Ringkasan Prestasi Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-700">
                                    <thead className="text-xs text-gray-900 uppercase bg-purple-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Kategori</th>
                                        <th scope="col" className="px-6 py-3">Total Kompetisi</th>
                                        <th scope="col" className="px-6 py-3">Prestasi Diraih</th>
                                        <th scope="col" className="px-6 py-3">Tingkat Kemenangan</th>
                                        <th scope="col" className="px-6 py-3">Prestasi Bulan Ini</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reportData.categoryStats.map((category, index) => (
                                        <tr key={index} className="bg-white border-b hover:bg-purple-50">
                                            <td className="px-6 py-4 font-medium">{category.name}</td>
                                            <td className="px-6 py-4">{category.competitions}</td>
                                            <td className="px-6 py-4">{category.wins}</td>
                                            <td className="px-6 py-4">{((category.wins / category.competitions) * 100).toFixed(1)}%</td>
                                            <td className="px-6 py-4">
                                                {reportData.monthlyTrend[reportData.monthlyTrend.length - 1].achievements || 0}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-12">
                        <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Export Laporan
                                </CardTitle>
                                <Dialog>
                                    <DialogTrigger>
                                        <FileDown
                                            size="20"
                                            className="hover:opacity-70"
                                        />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Ekspor ke Excel</DialogTitle>
                                        </DialogHeader>
                                        <div>
                                            <Label>Periode</Label>
                                            <Select
                                                onValueChange={(value) => setExportYear(value)}
                                                value={exportYear ?? 'all'}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Periode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Periode</SelectItem>
                                                    {periods.map((period) => (
                                                        <SelectItem key={period.id} value={period.name}>
                                                            {period.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Kategori</Label>
                                            <Select
                                                onValueChange={(value) => setExportCategory(value)}
                                                value={exportCategory}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                                    <SelectItem value="programming">Programming</SelectItem>
                                                    <SelectItem value="design">Design</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="research">Research</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Tingkat</Label>
                                            <Select
                                                onValueChange={(value) => setExportLevel(value)}
                                                value={exportLevel}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Tingkat" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Tingkat</SelectItem>
                                                    <SelectItem value="5">Internasional</SelectItem>
                                                    <SelectItem value="4">Nasional</SelectItem>
                                                    <SelectItem value="3">Regional</SelectItem>
                                                    <SelectItem value="2">Provinsi</SelectItem>
                                                    <SelectItem value="1">Lokal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="default"
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                onClick={handleExport}
                                                disabled={loading}
                                            >
                                                {loading ? 'Generating...' : 'Ekspor'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Laporan akan mencakup semua data berdasarkan filter yang dipilih dan dapat digunakan untuk keperluan dokumentasi dan akreditasi.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Distribusi Tingkat Kompetisi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={reportData.levelDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ level, percentage }) => `${level} (${percentage}%)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {reportData.levelDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <TopPerformersList performers={reportData.topPerformers} />
                    <RecommendationStatsList stats={reportData.recommendationStats} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReportsPage;
