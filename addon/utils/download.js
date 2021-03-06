import { all } from 'rsvp';
// import { saveAs } from 'file-saver';

export function downloadFile(fileName, content, contentType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: contentType });

  // saveAs(blob, fileName);
}

// [{name: 'file1', file: 'data'}, {name: 'file2', file: 'data2'}]
export function generateZip(files) {
  const zip = new window.JSZip();

  for ( let i = 0 ; i < files.length ; i++ ) {
    let file = files[i];

    zip.file(file.name, file.file);
  }

  return zip.generateAsync({ type: 'blob' }).then((contents) => {
    return contents;
  });
}

export function downloadResourceYaml(resources){
  if ( !resources.length ) {
    return;
  }

  if ( resources.length <= 1 ) {
    let resource = resources[0];

    if ( resource.fetchYaml ) {
      resource.fetchYaml().then((yaml) => {
        downloadFile(`${ resource.displayName }.yaml`, yaml);
      });
    }
  } else {
    let hashRequest = [];

    for ( let i = 0; i < resources.length; i++ ) {
      hashRequest.push(resources[i].fetchYaml());
    }

    all(hashRequest).then((data) => {
      let files = data.map((ele, index) => {
        return {
          name: `${ resources[index].displayName  }.yaml`,
          file: ele
        };
      });

      generateZip(files).then((zip) => {
        downloadFile(`${ resources[0].type  }.zip`, zip, zip.type);
      });
    });
  }
}
