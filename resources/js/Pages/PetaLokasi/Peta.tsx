import AuthenticatedLayout from "@/Layouts/AuthLayout";
import { useState, useEffect, useRef } from "react";

type Report = {
    id: number;
    tanggal: string;
    deskripsi: string;
    status_laporan: string;
    tipe_tiang: string;
    lokasi: string;
    petugas_mitra: string;
    latitude: number;
    longitude: number;
    nama_mitra: string;
};

type Props = {
    auth: any;
    report: Report[];
};

const STATUS_COLOR: any = {
    selesai: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Selesai",
    },
    proses: {
        bg: "bg-sky-100",
        text: "text-sky-700",
        label: "Proses",
    },
    pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Pending",
    },
};

export default function TiangMap({ auth, report }: Props) {
    const mapRef = useRef<any>(null);
    const leafletMapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const [loaded, setLoaded] = useState(false);
    const [search, setSearch] = useState("");

    const POLES = report.map((item) => ({
        id: item.id,
        name: item.lokasi,
        lat: parseFloat(String(item.latitude)),
        lng: parseFloat(String(item.longitude)),
        type: item.tipe_tiang,
        status: item.status_laporan,
        description: item.deskripsi,
        mitra: item.nama_mitra,
        petugas: item.petugas_mitra,
        tanggal: item.tanggal,
    }));

    const [selected, setSelected] = useState<any>(
        POLES[0] || null
    );

    const stats = {
        total: POLES.length,
        aktif: POLES.filter(
            (p) => p.status === "proses" || p.status === "selesai"
        ).length,
        pending: POLES.filter(
            (p) => p.status === "pending"
        ).length,
    };

    useEffect(() => {
        const linkCSS = document.createElement("link");
        linkCSS.rel = "stylesheet";
        linkCSS.href =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

        document.head.appendChild(linkCSS);

        const script = document.createElement("script");
        script.src =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

        script.onload = () => setLoaded(true);

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(linkCSS);
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (
            !loaded ||
            !mapRef.current ||
            leafletMapRef.current
        )
            return;

        const L = (window as any).L;

        const map = L.map(mapRef.current, {
            center: [1.105, 104.03],
            zoom: 12,
            zoomControl: false,
        });

        L.control.zoom({
            position: "bottomright",
        }).addTo(map);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "© OpenStreetMap contributors",
            }
        ).addTo(map);

        const createIcon = (active: boolean) =>
            L.divIcon({
                className: "",
                html: `
          <div style="
            width:40px;
            height:48px;
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <div style="
              width:40px;
              height:40px;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              background:${active ? "#0EA5E9" : "#F59E0B"};
              display:flex;
              align-items:center;
              justify-content:center;
              box-shadow:0 2px 8px rgba(0,0,0,0.25);
            ">
              <svg
                style="transform:rotate(45deg)"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
          </div>
        `,
                iconSize: [40, 48],
                iconAnchor: [20, 48],
                popupAnchor: [0, -50],
            });

        POLES.forEach((pole) => {
            const isActive =
                pole.status !== "pending";

            const marker = L.marker(
                [pole.lat, pole.lng],
                {
                    icon: createIcon(isActive),
                }
            ).addTo(map);

            marker.on("click", () =>
                setSelected(pole)
            );

            markersRef.current.push({
                id: pole.id,
                marker,
            });
        });

        leafletMapRef.current = map;
    }, [loaded]);

    useEffect(() => {
        if (
            !leafletMapRef.current ||
            !selected
        )
            return;

        leafletMapRef.current.setView(
            [selected.lat, selected.lng],
            15,
            {
                animate: true,
            }
        );
    }, [selected]);

    const filtered = POLES.filter((p) =>
        p.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const statusInfo =
        STATUS_COLOR[selected?.status] ||
        STATUS_COLOR.proses;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">

                {/* MAP */}
                <div className="relative flex-1">
                    <div
                        ref={mapRef}
                        className="w-full h-full"
                    />

                    {/* SEARCH */}
                    <div className="absolute top-4 left-4 right-4 z-[1000] max-w-sm">
                        <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-3">
                            <input
                                className="flex-1 text-sm text-slate-700 outline-none"
                                placeholder="Cari lokasi..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {search && (
                            <div className="mt-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                                {filtered.length ===
                                0 ? (
                                    <div className="px-4 py-3 text-sm text-slate-400">
                                        Tidak ditemukan
                                    </div>
                                ) : (
                                    filtered.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setSelected(
                                                    p
                                                );
                                                setSearch(
                                                    ""
                                                );
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100"
                                        >
                                            <div className="font-medium text-sm">
                                                {
                                                    p.name
                                                }
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                {
                                                    p.lat
                                                }
                                                ,
                                                {
                                                    p.lng
                                                }
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* STATS */}
                    <div className="absolute bottom-4 left-4 z-[1000]">
                        <div className="bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-6">
                            <div>
                                <div className="text-xs text-slate-400">
                                    Total
                                </div>

                                <div className="text-2xl font-bold">
                                    {
                                        stats.total
                                    }
                                </div>
                            </div>

                            <div className="w-px h-10 bg-slate-100" />

                            <div>
                                <div className="text-xs text-slate-400">
                                    Aktif
                                </div>

                                <div className="text-2xl font-bold text-emerald-500">
                                    {
                                        stats.aktif
                                    }
                                </div>
                            </div>

                            <div className="w-px h-10 bg-slate-100" />

                            <div>
                                <div className="text-xs text-slate-400">
                                    Pending
                                </div>

                                <div className="text-2xl font-bold text-amber-500">
                                    {
                                        stats.pending
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAIL */}
                {selected && (
                    <div className="w-80 bg-white shadow-2xl overflow-y-auto">

                        {/* HEADER */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-base font-semibold text-slate-800">
                                    {selected.name}
                                </h2>

                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}
                                >
                                    {
                                        statusInfo.label
                                    }
                                </span>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="px-6 py-4 space-y-5">

                            {/* TIPE */}
                            <div>
                                <div className="text-xs text-slate-400">
                                    Tipe Tiang
                                </div>

                                <div className="text-sm font-semibold text-slate-700">
                                    {selected.type}
                                </div>
                            </div>

                            {/* MITRA */}
                            <div>
                                <div className="text-xs text-slate-400">
                                    Nama Mitra
                                </div>

                                <div className="text-sm font-semibold text-slate-700">
                                    {
                                        selected.mitra
                                    }
                                </div>
                            </div>

                            {/* PETUGAS */}
                            <div>
                                <div className="text-xs text-slate-400">
                                    Petugas Mitra
                                </div>

                                <div className="text-sm font-semibold text-slate-700">
                                    {
                                        selected.petugas
                                    }
                                </div>
                            </div>

                            {/* TANGGAL */}
                            <div>
                                <div className="text-xs text-slate-400">
                                    Tanggal
                                </div>

                                <div className="text-sm font-semibold text-slate-700">
                                    {
                                        selected.tanggal
                                    }
                                </div>
                            </div>

                            {/* KOORDINAT */}
                            <div>
                                <div className="text-xs text-slate-400">
                                    Koordinat
                                </div>

                                <div className="text-sm font-semibold text-slate-700">
                                    {selected.lat},{" "}
                                    {selected.lng}
                                </div>
                            </div>

                            {/* DESKRIPSI */}
                            <div>
                                <div className="text-xs text-slate-400 mb-1">
                                    Deskripsi
                                </div>

                                <div className="text-sm text-slate-700">
                                    {
                                        selected.description
                                    }
                                </div>
                            </div>
                        </div>

                        {/* LIST */}
                        <div className="px-6 pb-6">
                            <div className="text-sm font-medium text-slate-600 mb-3">
                                Semua Lokasi
                            </div>

                            <div className="space-y-2">
                                {POLES.map((p) => {
                                    const sc =
                                        STATUS_COLOR[
                                            p.status
                                        ] ||
                                        STATUS_COLOR.proses;

                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() =>
                                                setSelected(
                                                    p
                                                )
                                            }
                                            className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                                                selected.id ===
                                                p.id
                                                    ? "bg-sky-50 border border-sky-200"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm">
                                                    {
                                                        p.name
                                                    }
                                                </span>

                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}
                                                >
                                                    {
                                                        sc.label
                                                    }
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-400 mt-1">
                                                {
                                                    p.type
                                                }
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}