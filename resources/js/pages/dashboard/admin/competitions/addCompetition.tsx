import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import CustomInput from "@/components/ui/shared/customInput";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { CalendarIcon, ChevronLeft, ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";
import ReactSelect from "react-select";

type Props = {
    categories: {
        id: number;
        name: string;
    }[];
    periods: {
        id: number;
        name: string;
        year: string;
    }[];
    skills: {
        id: number;
        name: string;
    }[];
};

type FormData = {
    name: string;
    author: string;
    image: File | null;
    category_id: string;
    period_id: string;
    level: string;
    status: string;
    description: string;
    start_date: string;
    end_date: string;
    verified_status: string;
    skills: number[];
};

export default function AddCompetition({ categories, periods, skills }: Props) {
    const query = useQueryClient();

    const { data, setData, errors, post, processing } = useForm<FormData>({
        name: "",
        author: "",
        image: null,
        category_id: "",
        period_id: "",
        level: "",
        status: "",
        verified_status: "pending",
        description: "",
        start_date: "",
        end_date: "",
        skills: []
    });

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7)
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setData("image", file);
        }
    };

    const groupedPeriods = useMemo(() => {
        return periods.reduce<Record<string, typeof periods>>((acc, period) => {
            if (!acc[period.year]) acc[period.year] = [];
            acc[period.year].push(period);
            return acc;
        }, {});
    }, [periods]);

    useEffect(() => {
        if (date?.from && date?.to) {
            setData("start_date", format(date.from, "yyyy-MM-dd"));
            setData("end_date", format(date.to, "yyyy-MM-dd"));
        }
    }, [date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.start_date || !data.end_date) {
            toast.error("Silakan pilih tanggal mulai dan akhir.");
            return;
        }

        post(route("admin.competitions.create.post"), {
            onSuccess: (data) => {
                toast.success(data.props.success);
                query.invalidateQueries({
                    queryKey: ["competitions"]
                });
            },
            onError: (error) => {
                Object.keys(error).forEach((key) => toast.error(error[key]));
            }
        });
    };

    return (
        <AdminLayout title="Tambah Lomba">
            <div className="container mx-auto py-4">
                <div className="inline-flex w-full justify-between items-end">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="bg-white"
                            onClick={() => window.history.back()}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </div>
                </div>
                <div className="mt-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                            {posterPreview ? (
                                <div className="relative w-full max-w-md">
                                    <div className="aspect-[3/4] relative rounded-md overflow-hidden">
                                        <img
                                            src={
                                                posterPreview ||
                                                "/placeholder.svg"
                                            }
                                            alt="Preview poster"
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setPosterPreview(null)}
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 p-4 bg-purple-100 rounded-full">
                                        <ImageIcon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="text-center mb-4">
                                        <p className="text-sm font-medium">
                                            Unggah poster kompetisi
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG atau JPEG (maks. 2MB)
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Pilih File
                                    </Button>
                                </>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="hidden"
                                onChange={handlePosterChange}
                            />
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-5">
                            <CustomInput
                                label="Nama"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                value={data.name}
                                type="text"
                                placeholder="Nama Kompetisi"
                                error={errors.name}
                                required
                            />
                            <CustomInput
                                label="PENYELENGGARA"
                                onChange={(e) =>
                                    setData("author", e.target.value)
                                }
                                value={data.author}
                                type="text"
                                placeholder="Polinema"
                                error={errors.author}
                                required
                            />
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-5">
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Kategori
                                </Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) =>
                                        setData("category_id", value.toString())
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
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
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Periode
                                </Label>
                                <Select
                                    value={data.period_id}
                                    onValueChange={(value) =>
                                        setData("period_id", value.toString())
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Pilih Periode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(groupedPeriods).map(
                                            ([year, items]) => (
                                                <SelectGroup key={year}>
                                                    <SelectLabel className="text-purple-900 font-semibold">
                                                        {year}
                                                    </SelectLabel>
                                                    {items.map((period) => (
                                                        <SelectItem
                                                            key={period.id}
                                                            value={period.id.toString()}
                                                        >
                                                            {period.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-5">
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Level
                                </Label>
                                <Select
                                    value={data.level}
                                    onValueChange={(value) =>
                                        setData("level", value.toString())
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Internasional
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Nasional
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Regional
                                        </SelectItem>
                                        <SelectItem value="4">
                                            Provinsi
                                        </SelectItem>
                                        <SelectItem value="5">
                                            Universitas
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.level && (
                                    <small className="text-xs text-red-500">
                                        * {errors.level}
                                    </small>
                                )}
                            </div>
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Status
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData("status", value.toString())
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ongoing">
                                            Sedang Berlangsung
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Selesai
                                        </SelectItem>
                                        <SelectItem value="canceled">
                                            Dibatalkan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <small className="text-xs text-red-500">
                                        * {errors.status}
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-5">
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Tanggal Mulai - Selesai
                                </Label>
                                <div className="grid-gap-2 mt-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[300px] justify-start text-left font-normal",
                                                    !date &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {date?.from ? (
                                                    date.to ? (
                                                        <>
                                                            {format(
                                                                date.from,
                                                                "LLL dd, y"
                                                            )}{" "}
                                                            -{" "}
                                                            {format(
                                                                date.to,
                                                                "LLL dd, y"
                                                            )}
                                                        </>
                                                    ) : (
                                                        format(
                                                            date.from,
                                                            "LLL dd, y"
                                                        )
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                onSelect={setDate}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {errors.start_date && (
                                    <small className="text-xs text-red-500">
                                        * {errors.start_date}
                                    </small>
                                )}
                                {errors.end_date && (
                                    <small className="text-xs text-red-500">
                                        * {errors.end_date}
                                    </small>
                                )}
                            </div>
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Skill yang dibutuhkan
                                </Label>
                                <ReactSelect
                                    isMulti
                                    options={skills.map((skill) => ({
                                        value: skill.id,
                                        label: skill.name
                                    }))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(selectedOptions) => {
                                        const selectedSkillIds = (
                                            selectedOptions || []
                                        ).map((option) => option.value);
                                        setData("skills", selectedSkillIds); // Hanya kirim ID ke backend
                                    }}
                                    value={skills
                                        .filter((skill) =>
                                            data.skills.includes(skill.id)
                                        )
                                        .map((skill) => ({
                                            value: skill.id,
                                            label: skill.name
                                        }))}
                                />

                                {errors.skills && (
                                    <small className="text-xs text-red-500">
                                        * {errors.skills}
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-5">
                            <div className="w-full">
                                <Label className="uppercase text-purple-900">
                                    Status Verifikasi
                                </Label>
                                <Select
                                    value={data.verified_status}
                                    onValueChange={(value) =>
                                        setData(
                                            "verified_status",
                                            value.toString()
                                        )
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Verified Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="accepted">
                                            Accepted
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.verified_status && (
                                    <small className="text-xs text-red-500">
                                        * {errors.verified_status}
                                    </small>
                                )}
                            </div>
                            <div></div>
                        </div>

                        <div className="w-full">
                            <Label className="uppercase text-purple-900">
                                Deskripsi
                            </Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            ></Textarea>
                            {errors.description && (
                                <small className="text-xs text-red-500">
                                    * {errors.description}
                                </small>
                            )}
                        </div>

                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {processing ? "Loading..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
