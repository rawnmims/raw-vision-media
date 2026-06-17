import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* R with black background */}
              <div className="flex items-center justify-center gap-1 mb-4">
                <span
                  className="font-condensed text-7xl text-white"
                  style={{ background: '#000', padding: '0 8px', lineHeight: 1 }}
                >
                  R
                </span>
                <span className="font-condensed text-7xl text-white">AW</span>
              </div>
              <motion.p
                className="font-oswald text-sm tracking-[0.3em] text-gray-400 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Vision Media
              </motion.p>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
