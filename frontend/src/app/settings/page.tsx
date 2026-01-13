'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Moon,
  Sun,
  Bell,
  Database,
  Palette,
  Shield,
  Download,
  Upload,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-white/60 mt-1">Customize your DevTracker experience</p>
      </motion.div>

      {/* Appearance */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-white/60">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              <button className="glass-button p-3 bg-white/10">
                <Sun className="w-5 h-5" />
              </button>
              <button className="glass-button-primary p-3">
                <Moon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Accent Color</p>
              <p className="text-sm text-white/60">Customize the accent color</p>
            </div>
            <div className="flex gap-2">
              {['#8b5cf6', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/40 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Glassmorphism Intensity</p>
              <p className="text-sm text-white/60">Adjust the blur and transparency</p>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-32 accent-purple-500"
            />
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-pink-500/20">
            <Bell className="w-5 h-5 text-pink-400" />
          </div>
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Daily Reminders</p>
              <p className="text-sm text-white/60">Get reminded about pending tasks</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Deadline Alerts</p>
              <p className="text-sm text-white/60">Get notified before deadlines</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-white/60">Receive weekly progress reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      </GlassCard>

      {/* Data Management */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold">Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-white/60">Download all your data as JSON</p>
            </div>
            <button className="glass-button flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Import Data</p>
              <p className="text-sm text-white/60">Restore from a backup</p>
            </div>
            <button className="glass-button flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Sync Status</p>
              <p className="text-sm text-white/60">Last synced: Just now</p>
            </div>
            <button className="glass-button flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync Now
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-500/20">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div>
              <p className="font-medium">Clear All Data</p>
              <p className="text-sm text-white/60">
                This will permanently delete all your data
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Version Info */}
      <div className="text-center text-white/40 text-sm py-4">
        <p>DevTracker v1.0.0</p>
        <p>Built with ❤️ for developers</p>
      </div>
    </div>
  );
}
