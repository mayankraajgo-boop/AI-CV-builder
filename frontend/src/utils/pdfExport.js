import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Pixel-perfect PDF export using html2canvas + jsPDF.
 *
 * Strategy:
 *  - Capture the element at its NATURAL height (no forced min-height).
 *  - Convert canvas pixels → mm using the actual DPI ratio.
 *  - If content fits one A4 page → single page, no gaps.
 *  - If content overflows → slice the canvas into A4-height strips,
 *    one strip per PDF page, so layout never breaks mid-element.
 */
export const exportToPDF = async (elementId, filename = 'resume') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found');

  // ── 1. Snapshot original styles ──────────────────────────────────────────
  const orig = {
    width:        element.style.width,
    minHeight:    element.style.minHeight,
    maxWidth:     element.style.maxWidth,
    boxShadow:    element.style.boxShadow,
    borderRadius: element.style.borderRadius,
    overflow:     element.style.overflow,
  };

  // ── 2. Set capture width to A4 pixel width (794px @ 96dpi) ───────────────
  //    Do NOT set minHeight — let content determine height naturally.
  element.style.width        = '794px';
  element.style.maxWidth     = '794px';
  element.style.minHeight    = 'unset';
  element.style.boxShadow    = 'none';
  element.style.borderRadius = '0';
  element.style.overflow     = 'visible';

  // Small delay so browser reflows before capture
  await new Promise((r) => setTimeout(r, 120));

  try {
    const canvas = await html2canvas(element, {
      scale:           2,        // retina quality
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           794,
      windowWidth:     794,
      // Capture full scrollable height
      height:          element.scrollHeight,
      windowHeight:    element.scrollHeight,
    });

    // ── 3. Compute dimensions ─────────────────────────────────────────────
    // canvas is at scale=2, so 1 canvas px = 0.5 screen px
    // 794 screen px = 210mm  →  1 screen px = 210/794 mm
    // 1 canvas px = 210/(794*2) mm
    const mmPerCanvasPx = 210 / (794 * 2);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW  = pdf.internal.pageSize.getWidth();   // 210 mm
    const pageH  = pdf.internal.pageSize.getHeight();  // 297 mm

    const imgW   = canvas.width;   // canvas pixels
    const imgH   = canvas.height;  // canvas pixels

    const totalMmH = imgH * mmPerCanvasPx;  // total content height in mm

    if (totalMmH <= pageH) {
      // ── Single page — exact fit, no extra whitespace ──────────────────
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.97),
        'JPEG', 0, 0, pageW, totalMmH
      );
    } else {
      // ── Multi-page — slice canvas into A4-height strips ───────────────
      const stripPx = Math.floor(pageH / mmPerCanvasPx); // canvas px per page
      let yPx = 0;
      let pageNum = 0;

      while (yPx < imgH) {
        const sliceH = Math.min(stripPx, imgH - yPx);

        // Create a temporary canvas for this strip
        const strip = document.createElement('canvas');
        strip.width  = imgW;
        strip.height = sliceH;
        const ctx = strip.getContext('2d');
        ctx.drawImage(canvas, 0, yPx, imgW, sliceH, 0, 0, imgW, sliceH);

        const sliceMmH = sliceH * mmPerCanvasPx;

        if (pageNum > 0) pdf.addPage();
        pdf.addImage(strip.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, pageW, sliceMmH);

        yPx += sliceH;
        pageNum++;
      }
    }

    pdf.save((filename || 'resume') + '.pdf');
  } finally {
    // ── 4. Restore original styles ────────────────────────────────────────
    element.style.width        = orig.width;
    element.style.minHeight    = orig.minHeight;
    element.style.maxWidth     = orig.maxWidth;
    element.style.boxShadow    = orig.boxShadow;
    element.style.borderRadius = orig.borderRadius;
    element.style.overflow     = orig.overflow;
  }
};
