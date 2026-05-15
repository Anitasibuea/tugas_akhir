<?php

namespace Database\Seeders;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]
            ->forgetCachedPermissions();
        
         /*
        |--------------------------------------------------------------------------
        | PERMISSIONS
        |--------------------------------------------------------------------------
        */

        Permission::create(['name' => 'report.view']);
        Permission::create(['name' => 'report.create']);
        Permission::create(['name' => 'report.edit']);
        Permission::create(['name' => 'report.delete']);

        Permission::create(['name' => 'report.status.edit']);

        Permission::create(['name' => 'mitra.view']);

        Permission::create(['name' => 'tiang.view']);

        Permission::create(['name' => 'user.manage']);

        /*
        |--------------------------------------------------------------------------
        | ROLES
        |--------------------------------------------------------------------------
        */

        $admin = Role::create(['name' => 'admin']);

        $petugas = Role::create(['name' => 'petugas']);

        $manajer = Role::create(['name' => 'manajer']);

        $mitra = Role::create(['name' => 'mitra']);

        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */

        $admin->givePermissionTo(Permission::all());

        /*
        |--------------------------------------------------------------------------
        | PETUGAS
        |--------------------------------------------------------------------------
        */

        $petugas->givePermissionTo([
            'report.view',
            'report.create',
            'report.edit',
        ]);

        /*
        |--------------------------------------------------------------------------
        | MANAJER
        |--------------------------------------------------------------------------
        */

        $manajer->givePermissionTo([
            'report.view',
            'report.status.edit',
            'mitra.view',
            'tiang.view',
        ]);

        /*
        |--------------------------------------------------------------------------
        | MITRA
        |--------------------------------------------------------------------------
        */

        $mitra->givePermissionTo([
            'report.view',
        ]);
    
    }
}
