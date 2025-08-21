import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/config/supabaseAdmin'

export async function GET(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: me, error: meErr } = await supabaseAdmin.auth.getUser(token)
    if (meErr || !me?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const role = me.user.user_metadata?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) throw error

    const users = data.users.map((u) => ({
      id: u.id,
      email: u.email,
      user_metadata: u.user_metadata,
    }))

    return NextResponse.json({ users })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


