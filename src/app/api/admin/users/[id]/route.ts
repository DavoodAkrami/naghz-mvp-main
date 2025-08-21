import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/config/supabaseAdmin'

export async function PATCH(req: NextRequest, context: any) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }
  const userId = context?.params?.id as string
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: me, error: meErr } = await supabaseAdmin.auth.getUser(token)
    if (meErr || !me?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const role = me.user.user_metadata?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { role: newRole } = body || {}
    if (!newRole || !['admin', 'user'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    })
    if (error) throw error

    return NextResponse.json({ ok: true, user: { id: data.user?.id, user_metadata: data.user?.user_metadata, email: data.user?.email } })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: any) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }
  const userId = context?.params?.id as string
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: me, error: meErr } = await supabaseAdmin.auth.getUser(token)
    if (meErr || !me?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const role = me.user.user_metadata?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


