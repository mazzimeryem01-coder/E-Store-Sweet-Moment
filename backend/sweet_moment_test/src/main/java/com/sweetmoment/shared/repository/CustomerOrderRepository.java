package com.sweetmoment.shared.repository;

import com.sweetmoment.shared.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByUserIdOrderByOrderDateDesc(Long userId);
}
