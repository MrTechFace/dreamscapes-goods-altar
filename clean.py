import re

with open("c:\\Users\\mrtec\\.gemini\\antigravity\\MikkeyFactoid\\dreamscapes-goods\\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the omelette injected script from <style data-omelette-injected="">... to the </script> tag
content = re.sub(r'<style data-omelette-injected="">.*?</script>', '', content, flags=re.DOTALL)

# Remove the massive transpiled code block
content = re.sub(r'<style data-designer-overlay="1"></style><script>"use strict";.*?</script>\s*(?=<script src="assets/react\.development\.js")', '', content, flags=re.DOTALL)

with open("c:\\Users\\mrtec\\.gemini\\antigravity\\MikkeyFactoid\\dreamscapes-goods\\index.html", "w", encoding="utf-8") as f:
    f.write(content)
