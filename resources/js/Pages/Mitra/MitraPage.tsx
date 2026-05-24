import AuthLayout from '@/Layouts/AuthLayout'
import CompanyCard from '@/Components/MitraCard'
import { PageProps } from '@/types'
import React, { useState } from 'react'

export default function MitraPage({ auth }: PageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('semua')

  // Sample data - you can replace this with actual data from your backend
  const companies = [
    {
      id: 1,
      companyName: "PT Batam Bintan Telekomunikasi",
      address: "Jl. Engku Putri No. 45, Batam Centre",
      phone: "+62 778 123456",
      email: "contact@bbt.co.id",
      petugasMapping: "Ahmad Rifai",
      status: "Aktif"
    },
    {
      id: 2,
      companyName: "PT Teknologi Nusantara",
      address: "Jl. Raya Soekarno-Hatta No. 88, Batam",
      phone: "+62 778 987654",
      email: "info@teknus.co.id",
      petugasMapping: "Budi Santoso",
      status: "Nonaktif"
    },
    {
      id: 3,
      companyName: "CV Digital Solusi",
      address: "Komplek Bizpark Blok A No. 12, Batam",
      phone: "+62 778 456789",
      email: "cs@digitalsolusi.com",
      petugasMapping: "Citra Dewi",
      status: "Aktif"
    }
  ]

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.petugasMapping.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'semua' || company.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleTambahMitra = () => {
    console.log("Tambah mitra baru")
    // Navigate to add mitra page or open modal
  }

  const handleLihatDetail = (id: number) => {
    console.log("Detail mitra:", id)
  }

  const handleEdit = (id: number) => {
    console.log("Edit mitra:", id)
  }

  return (
    <AuthLayout user={auth.user}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Mitra</h1>
            <p className="text-gray-600">Kelola dan pantau semua data mitra perusahaan Anda</p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                </div>
                <input
                  type="text"
                  placeholder="Cari mitra berdasarkan nama atau petugas mapping..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                </div>
              </div>
              
              <button
                onClick={handleTambahMitra}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tambah Mitra
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan {filteredCompanies.length} dari {companies.length} mitra
          </div>

          {/* Cards Grid */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="transform transition duration-300 hover:scale-105">
                  <CompanyCard
                    companyName={company.companyName}
                    address={company.address}
                    phone={company.phone}
                    email={company.email}
                    petugasMapping={company.petugasMapping}
                    status={company.status}
                    onLihatDetail={() => handleLihatDetail(company.id)}
                    onEdit={() => handleEdit(company.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada mitra ditemukan</h3>
              <p className="text-gray-500">Coba dengan kata kunci pencarian yang berbeda atau tambahkan mitra baru</p>
              <button
                onClick={handleTambahMitra}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-150 ease-in-out"
              >
                Tambah Mitra Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}