

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

function Array2Buffer(array, iSize, nSize) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
  buffer.itemSize = iSize;
  buffer.numItems = nSize;
  return buffer;
}

function drawElement(buffer, textureobj, hasTexture, bodyColor = [1.0, 1.0, 1.0]) {
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(
      app.programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      app.programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the texture coordinates from
  // the texture coordinate buffer into the textureCoord attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.textureCoord);
    gl.vertexAttribPointer(
      app.programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      app.programInfo.attribLocations.textureCoord);
  }

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
    gl.vertexAttribPointer(
        app.programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        app.programInfo.attribLocations.vertexNormal);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(app.programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    app.programInfo.uniformLocations.projectionMatrix,
    false,
    app.projectionMatrix);
  gl.uniformMatrix4fv(
    app.programInfo.uniformLocations.modelViewMatrix,
    false,
    app.modelViewMatrix);
  gl.uniformMatrix4fv(
      app.programInfo.uniformLocations.normalMatrix,
      false,
      app.normalMatrix);
  gl.uniform1i(app.programInfo.uniformLocations.hasTexture, hasTexture);
  gl.uniform4f(app.programInfo.uniformLocations.bodyColor, bodyColor[0], bodyColor[1], bodyColor[2], bodyColor[3]);

  // Specify the texture to map onto the faces.

  if (hasTexture) {
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, textureobj.texture);
  }
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(app.programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = buffer.vertexCount;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function mvPushMatrix() {
  var copy = [];
  mat4.copy(copy, app.modelViewMatrix);
  app.mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (app.mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mat4.copy(app.modelViewMatrix, app.mvMatrixStack.pop());
  //app.modelViewMatrix = app.mvMatrixStack.pop();
}