/**
 * PDF Export Utility for Smart Resume Analyzer ATS Reports
 * Generates and downloads styled A4 PDF documents.
 */

export const exportAtsReportPdf = async (elementId, filename = 'ATS_Resume_Analysis_Report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export.`);
    return false;
  }

  try {
    // Dynamically import html2pdf if available
    let html2pdfModule;
    try {
      const mod = await import('html2pdf.js');
      html2pdfModule = mod.default || mod;
    } catch (e) {
      console.warn('html2pdf module direct import, attempting window fallback:', e);
      html2pdfModule = window.html2pdf;
    }

    if (html2pdfModule) {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdfModule().set(opt).from(element).save();
      return true;
    } else {
      // Fallback: Trigger browser print with printable styling
      window.print();
      return true;
    }
  } catch (error) {
    console.error('Error generating PDF report:', error);
    // Fallback to print dialog
    window.print();
    return false;
  }
};
