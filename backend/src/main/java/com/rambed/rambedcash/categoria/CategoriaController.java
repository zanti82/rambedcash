package com.rambed.rambedcash.categoria;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> listarActivas() {
        return ResponseEntity.ok(categoriaService.listarActivas());
    }

    @GetMapping("/por-tipo")
    public ResponseEntity<List<Categoria>> listarPorTipo(
            @RequestParam Categoria.TipoMovimiento tipo) {
        return ResponseEntity.ok(categoriaService.listarPorTipo(tipo));
    }

    @PostMapping
    public ResponseEntity<Categoria> crear(@Valid @RequestBody CategoriaDTO dto) {
        Categoria nueva = categoriaService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        categoriaService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}