import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, Trophy, Users, TrendingUp, Filter, Activity, Award, Target, FileDown, Loader2 } from 'lucide-react';
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

// Types for API responses
interface SummaryStats {
    totalStudents: number;
    totalCompetitions: number;
    totalAchievements: number;
    winRate: number;
}

interface CategoryStat {
    name: string;
    competitions: number;
    wins: number;
    students: number;
}

interface LevelDistribution {
    level: string;
    count: number;
    percentage: number;
}

interface MonthlyTrend {
    month: string;
    competitions: number;
    achievements: number;
}

interface TopPerformer {
    name: string;
    nim: string;
    achievements: number;
    categories: string[];
    prodi?: string;
}

interface RecommendationStats {
    totalRecommendations: number;
    acceptedRecommendations: number;
    successRate: number;
    averageMatchScore: number;
}

interface ReportData {
    summary: SummaryStats;
    categoryStats: CategoryStat[];
    levelDistribution: LevelDistribution[];
    monthlyTrend: MonthlyTrend[];
    topPerformers: TopPerformer[];
    recommendationStats: RecommendationStats;
}

interface FilterOptions {
    years: string[];
    categories: Array<{ id: number; name: string }>;
    levels: Array<{ value: string; label: string }>;
}

const AdminReportsPage = () => {
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [exportYear, setExportYear] = useState<string>('all');
    const [exportCategory, setExportCategory] = useState<string>('all');
    const [exportLevel, setExportLevel] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const [exportLoading, setExportLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    // State for filter options and report data
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        years: [],
        categories: [],
        levels: []
    });

    const [reportData, setReportData] = useState<ReportData>({
        summary: {
            totalStudents: 0,
            totalCompetitions: 0,
            totalAchievements: 0,
            winRate: 0
        },
        categoryStats: [],
        levelDistribution: [],
        monthlyTrend: [],
        topPerformers: [],
        recommendationStats: {
            totalRecommendations: 0,
            acceptedRecommendations: 0,
            successRate: 0,
            averageMatchScore: 0
        }
    });

    // Fetch filter options
    const fetchFilterOptions = async () => {
        try {
            const response = await fetch('/admin/reports/filters');
            const data = await response.json();
            if (data.success) {
                setFilterOptions(data.data);
                // Set default year to the most recent year if available
                if (data.data.years.length > 0) {
                    setSelectedYear(data.data.years[0].toString());
                }
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    // Fetch report data
    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                year: selectedYear,
                category: selectedCategory,
                level: selectedLevel
            });

            const response = await fetch(`/admin/reports/data?${params}`);
            const data = await response.json();

            if (data.success) {
                setReportData(data.data);
            } else {
                console.error('Failed to fetch report data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            await fetchFilterOptions();
        };
        initializeData();
    }, []);

    // Fetch report data when filters change
    useEffect(() => {
        if (selectedYear) {
            fetchReportData();
        }
    }, [selectedYear, selectedCategory, selectedLevel]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

    const handleExport = () => {
        const yearParam = exportYear === 'all' ? null : exportYear;
        const categoryParam = exportCategory === 'all' ? null : exportCategory;
        const levelParam = exportLevel === 'all' ? null : exportLevel;

        const params = new URLSearchParams({
            period: yearParam ?? '',
            category: categoryParam ?? '',
            level: levelParam ?? ''
        });

        window.open(`/admin/reports/export?${params.toString()}`, '_blank');
    };




    // Reusable StatCard component
    const StatCard = ({ title, value, icon: Icon, trend, color = "purple" }) => (
        <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '+' : ''}{trend}% dari periode sebelumnya
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

    // Component for Top Performers
    const TopPerformersList = ({ performers, className = "" }) => (
        <Card className={`border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Top Performers
                </CardTitle>
            </CardHeader>
            <CardContent>
                {performers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Tidak ada data performer</p>
                ) : (
                    <div className="space-y-4">
                        {performers.map((student, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-purple-50/30 rounded-lg hover:bg-purple-100/30 transition-all">
                                <div>
                                    <p className="font-medium text-gray-900">{student.name}</p>
                                    <p className="text-sm text-gray-600">NIM: {student.nim}</p>
                                    {student.prodi && (
                                        <p className="text-sm text-gray-500">{student.prodi}</p>
                                    )}
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
                )}
            </CardContent>
        </Card>
    );

    // Component for Recommendation Stats
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

    if (initialLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Memuat data laporan...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <section className="mb-10">
                {/* Statistics cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    <StatCard
                        title="Total Mahasiswa Aktif"
                        value={reportData.summary.totalStudents.toLocaleString()}
                        icon={Users}
                    />
                    <StatCard
                        title="Total Kompetisi"
                        value={reportData.summary.totalCompetitions}
                        icon={Trophy}
                        color="green"
                    />
                    <StatCard
                        title="Total Prestasi"
                        value={reportData.summary.totalAchievements}
                        icon={Award}
                        color="purple"
                    />
                    <StatCard
                        title="Tingkat Keberhasilan"
                        value={`${reportData.summary.winRate}%`}
                        icon={Target}
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
                                            {filterOptions.years.map((year) => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
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
                                            {filterOptions.categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
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
                                            {filterOptions.levels.map((level) => (
                                                <SelectItem key={level.value} value={level.value}>
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                        type="button"
                                        disabled={loading}
                                        onClick={fetchReportData}
                                    >
                                        {loading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Filter className="mr-2 h-4 w-4" />
                                        )}
                                        {loading ? 'Memuat...' : 'Filter'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="lg:col-span-8 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Memuat data chart...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Prestasi Berdasarkan Kategori
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {reportData.categoryStats.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">Tidak ada data kategori untuk periode yang dipilih</p>
                                    ) : (
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
                                    )}
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
                                    {reportData.categoryStats.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">Tidak ada data untuk ditampilkan</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left text-gray-700">
                                                <thead className="text-xs text-gray-900 uppercase bg-purple-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">Kategori</th>
                                                    <th scope="col" className="px-6 py-3">Total Kompetisi</th>
                                                    <th scope="col" className="px-6 py-3">Prestasi Diraih</th>
                                                    <th scope="col" className="px-6 py-3">Tingkat Kemenangan</th>
                                                    <th scope="col" className="px-6 py-3">Mahasiswa Terlibat</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {reportData.categoryStats.map((category, index) => (
                                                    <tr key={index} className="bg-white border-b hover:bg-purple-50">
                                                        <td className="px-6 py-4 font-medium">{category.name}</td>
                                                        <td className="px-6 py-4">{category.competitions}</td>
                                                        <td className="px-6 py-4">{category.wins}</td>
                                                        <td className="px-6 py-4">
                                                            {category.competitions > 0
                                                                ? ((category.wins / category.competitions) * 100).toFixed(1)
                                                                : 0}%
                                                        </td>
                                                        <td className="px-6 py-4">{category.students}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <div className="lg:col-span-12">
                        <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Export Laporan
                                </CardTitle>
                                <Dialog>
                                    <DialogTrigger>
                                        <FileDown size="20" className="hover:opacity-70" />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Ekspor ke Excel</DialogTitle>
                                        </DialogHeader>

                                        <div>
                                            <Label>Periode</Label>
                                            <Select
                                                onValueChange={(value) => setExportYear(value)}
                                                value={exportYear}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Periode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Periode</SelectItem>
                                                    {filterOptions.years.map((year) => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
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
                                                    {filterOptions.categories.map((category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id.toString()}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
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
                                                    {filterOptions.levels.map((level) => (
                                                        <SelectItem key={level.value} value={level.value}>
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                variant="default"
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => {
                                                    const params = new URLSearchParams({
                                                        year: exportYear === "all" ? "" : exportYear,
                                                        category: exportCategory === "all" ? "" : exportCategory,
                                                        level: exportLevel === "all" ? "" : exportLevel,
                                                        format: "excel",
                                                    });
                                                    window.open(`/admin/reports/export?${params.toString()}`, "_blank");
                                                }}
                                            >
                                                Ekspor
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
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                <p className="text-gray-600 text-sm">Memuat...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Card className="border-2 border-purple-200 hover:shadow-md shadow-purple-100 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Distribusi Tingkat Kompetisi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {reportData.levelDistribution.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">Tidak ada data distribusi tingkat</p>
                                    ) : (
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
                                    )}
                                </CardContent>
                            </Card>
                            <TopPerformersList performers={reportData.topPerformers} />
                            <RecommendationStatsList stats={reportData.recommendationStats} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReportsPage;
