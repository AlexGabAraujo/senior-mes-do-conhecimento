package br.com.senior.mes_conhecimento.infrastructure.persistence.specifications;

import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.LectureEntity;
import org.springframework.data.jpa.domain.Specification;

public class LectureSpecification {

    public static Specification<LectureEntity> withFilters(LectureType type, Boolean finished) {
        return (root, query, criteriaBuilder) -> {
            Specification<LectureEntity> spec = Specification.where((Specification<LectureEntity>) null);

            if (type != null) {
                spec = spec.and((r, q, cb) -> cb.equal(r.get("type"), type));
            }

            if (finished != null) {
                spec = spec.and((r, q, cb) -> cb.equal(r.get("finished"), finished));
            }

            return spec.toPredicate(root, query, criteriaBuilder);
        };
    }
}
