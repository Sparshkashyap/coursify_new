import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="bg-slate-50 py-20">
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Privacy Policy
        </motion.h1>
      </section>

      <div className="container mt-10 max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.12 }}
          className="space-y-6"
        >
          {[
            {
              title: "Data Protection",
              text: "We respect your privacy and take strong measures to protect your personal information."
            },
            {
              title: "Data Usage",
              text: "Your data is never shared, sold, or distributed without your explicit consent."
            },
            {
              title: "Security Measures",
              text: "We use modern security technologies and encryption to safeguard your data."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-lg"
            >
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <p className="text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;