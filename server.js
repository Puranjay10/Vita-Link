const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pdfkit = require('pdfkit');
const Supplier = require('./models/Supplier');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/pharmtracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error });
    }
});

// Risk Assessment for a Supplier
app.get('/api/suppliers/:id/risk', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Risk assessment calculations
        const riskFactors = {
            deliveryPerformance: calculateDeliveryScore(supplier),
            qualityScore: calculateQualityScore(supplier),
            financialHealth: calculateFinancialScore(supplier),
            complianceScore: calculateComplianceScore(supplier)
        };

        // Weighted risk score
        const weights = {
            deliveryPerformance: 0.3,
            qualityScore: 0.3,
            financialHealth: 0.2,
            complianceScore: 0.2
        };

        const riskScore = calculateWeightedRiskScore(riskFactors, weights);
        const riskLevel = determineRiskLevel(riskScore);

        res.json({
            supplierId: supplier._id,
            name: supplier.name,
            riskScore: riskScore.toFixed(2),
            riskLevel,
            riskFactors,
            assessmentDate: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: 'Error assessing supplier risk', error });
    }
});

// PDF Report for a Supplier
app.get("/api/suppliers/:id/report", async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // Set up PDF document
        const doc = new pdfkit();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${supplier.name}_report.pdf`);

        doc.pipe(res);

        // Title
        doc.fontSize(20).text(`Supplier Report: ${supplier.name}`, { align: "center" });
        doc.moveDown(1);

        // Supplier Details
        doc.fontSize(12).text(`📍 Address: ${supplier.address}`);
        doc.text(`📧 Email: ${supplier.email}`);
        doc.text(`📞 Contact: ${supplier.contact}`);
        doc.moveDown(1);

        // Risk Assessment Details
        doc.fontSize(14).text("🔍 Risk Assessment", { underline: true });
        doc.fontSize(12).text(`Risk Score: ${supplier.riskScore}`);
        doc.text(`Risk Level: ${supplier.riskLevel}`);
        doc.text(`Compliance: ${supplier.complianceStatus ? "✅ Compliant" : "❌ Not Compliant"}`);
        doc.moveDown(1);

        // Risk Factors
        doc.fontSize(14).text("📊 Risk Factors", { underline: true });
        doc.fontSize(12).text(`✅ Delivery Performance: ${supplier.onTimeDeliveryRate * 10}/10`);
        doc.text(`✅ Quality Score: ${10 - (supplier.defectRate * 10 + supplier.returnRate * 5)}/10`);
        doc.text(`✅ Financial Stability: ${supplier.financialStabilityScore}/10`);
        doc.text(`✅ Compliance Score: ${supplier.complianceStatus ? 10 : 5}/10`);
        doc.moveDown(2);

        // Footer
        doc.fontSize(10).text(`Report Generated on: ${new Date().toLocaleString()}`, { align: "right" });

        // Finalize PDF
        doc.end();
    } catch (error) {
        res.status(500).json({ message: "Error generating report", error });
    }
});

// Risk assessment helper functions
function calculateDeliveryScore(supplier) {
    const onTimeRate = supplier.onTimeDeliveryRate || 0; // 0 to 1 scale
    const delayPenalty = supplier.averageDelayDays > 5 ? 2 : 0; // Reduce score if frequent delays
    return Math.min(10, Math.max(0, (onTimeRate * 10) - delayPenalty));
}

function calculateQualityScore(supplier) {
    const defectPenalty = supplier.defectRate * 10; // Higher defect rate reduces score
    const returnPenalty = supplier.returnRate * 5; // Higher return rate reduces score
    return Math.min(10, Math.max(0, 10 - (defectPenalty + returnPenalty)));
}

function calculateFinancialScore(supplier) {
    return Math.min(10, Math.max(0, supplier.financialStabilityScore)); // 0-10 scale
}

function calculateComplianceScore(supplier) {
    return supplier.complianceStatus ? 10 : 5; // 10 if compliant, 5 if not
}

function calculateWeightedRiskScore(factors, weights) {
    return Object.keys(factors).reduce((score, factor) => {
        return score + (factors[factor] * weights[factor]);
    }, 0);
}

function determineRiskLevel(score) {
    if (score >= 8) return 'LOW';
    if (score >= 6) return 'MEDIUM';
    return 'HIGH';
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
