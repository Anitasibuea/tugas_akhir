import AuthLayout from '@/Layouts/AuthLayout'
import { PageProps } from '@/types'
import React from 'react'

export default function MitraPage({auth} :PageProps) {
  return (
    <AuthLayout user={auth.user}>
        <div>
            <h1>Mitra Page</h1>
        </div>
    </AuthLayout>

  )
}
