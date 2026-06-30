package com.rambed.rambedcash.categoria;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<Categoria> listarActivas() {
        return categoriaRepository.findByActivaTrue();
    }

    public List<Categoria> listarPorTipo(Categoria.TipoMovimiento tipo) {
        return categoriaRepository.findByTipoMovimiento(tipo);
    }

    public Categoria crear(CategoriaDTO dto) {
        if (categoriaRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("Ya existe una categoria con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoria.setTipoMovimiento(dto.getTipoMovimiento());
        categoria.setClasificacion(dto.getClasificacion());
        categoria.setActiva(true);

        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Integer id, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        categoria.setNombre(dto.getNombre());
        categoria.setTipoMovimiento(dto.getTipoMovimiento());
        categoria.setClasificacion(dto.getClasificacion());

        return categoriaRepository.save(categoria);
    }

    public void desactivar(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        categoria.setActiva(false);
        categoriaRepository.save(categoria);
    }
}