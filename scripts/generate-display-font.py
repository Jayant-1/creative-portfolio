"""Optional asset regeneration: pip install 'fonttools[woff]==4.67.0'.

Freeze the same axes used by .ca-display; preserve the subset's glyph metrics.
The complete original variable font remains available for other consumers.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

root = Path(__file__).resolve().parents[1]
font = TTFont(root / "public/fonts/handjet.woff2")
font = instantiateVariableFont(font, {"wght": 700, "ELGR": 1, "ELSH": 7}, inplace=True)
options = subset.Options()
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=list(range(0x100)) + list(range(0x2000, 0x2C00)))
subsetter.subset(font)
font.flavor = "woff2"
font.save(root / "public/fonts/handjet-display.woff2")
