/* Compatibility entry point for existing page references to css\\js\\main.js.
   Correct legacy Windows-only image paths, then load the site's real script. */
(function () {
  function localAssetPath(value) {
    if (!value || !/^[A-Za-z]:[\\/]/.test(value)) return value;
    var filename = value.split(/[\\/]/).pop();
    return encodeURIComponent(filename);
  }

  function repairImagePaths() {
    document.querySelectorAll('img').forEach(function (image) {
      var source = image.getAttribute('src');
      var localSource = localAssetPath(source);
      if (localSource !== source) image.setAttribute('src', localSource);

      var srcset = image.getAttribute('srcset');
      if (srcset) {
        var repairedSrcset = srcset.split(',').map(function (candidate) {
          candidate = candidate.trim();
          var descriptorMatch = candidate.match(/\s+(\d+w|[\d.]+x)$/);
          var descriptor = descriptorMatch ? descriptorMatch[0] : '';
          var path = descriptor ? candidate.slice(0, -descriptor.length) : candidate;
          return localAssetPath(path) + descriptor;
        }).join(', ');
        image.setAttribute('srcset', repairedSrcset);
      }
    });
  }

  repairImagePaths();

  var siteScript = document.createElement('script');
  siteScript.src = 'main.js';
  siteScript.defer = false;
  document.body.appendChild(siteScript);
})();
