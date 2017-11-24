function convert(str){

  var obj = {
    vertices:[],
    normals:[],
    uv:[],
    index:[]
  }

  var array = str.split("\n");

  for (var i = 0; i < array.length; i++) {

    sub_array = array[i].split(" ");
    if (sub_array[0] == 'v') {
      obj.vertices.push(sub_array[1]);
      obj.vertices.push(sub_array[2]);
      obj.vertices.push(sub_array[3]);
    } else if (sub_array[0] == 'vt') {
      obj.uv.push(sub_array[1]);
      obj.uv.push(sub_array[2]);
    } else if (sub_array[0] == 'vn') {
      obj.normals.push(sub_array[1]);
      obj.normals.push(sub_array[2]);
      obj.normals.push(sub_array[3]);
    } else if (sub_array[0] == 'f') {
      sub_sub_array1 = sub_array[1].split("/");
      obj.index.push(sub_sub_array1[1]);
      obj.index.push(sub_sub_array1[2]);
      obj.index.push(sub_sub_array1[3]);
      sub_sub_array2 = sub_array[2].split("/");
      obj.index.push(sub_sub_array2[1]);
      obj.index.push(sub_sub_array2[2]);
      obj.index.push(sub_sub_array2[3]);
      sub_sub_array3 = sub_array[3].split("/");
      obj.index.push(sub_sub_array3[1]);
      obj.index.push(sub_sub_array3[2]);
      obj.index.push(sub_sub_array3[3]);

    }

  }

}
